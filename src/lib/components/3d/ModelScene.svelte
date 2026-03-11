<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, ContactShadows, HTML, interactivity, useGltf, useGltfAnimations } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { MeshStandardMaterial, ShaderMaterial, Box3, Vector3, Mesh, Vector2, Group, type Object3D, log } from 'three';
	import type { ProjectHotspot } from '$lib/types';

	// Enable Raycasting for hover events within Threlte
	interactivity();

	let { url, cursorPos = { x: 0, y: 0 }, xrayLensRadius = 120, hotspots = [] }: { 
		url: string; 
		cursorPos?: { x: number; y: number };
		xrayLensRadius?: number;
		hotspots?: ProjectHotspot[] 
	} = $props();

	// Hook-based loading gives us full access to the logical 3D tree
	const gltf = useGltf(url);
	const { actions, mixer } = useGltfAnimations(gltf);
	const { renderer } = useThrelte();

	let hasAnimations = false;
	const explodeSpring = spring(0, { stiffness: 0.08, damping: 0.35 });

	// X-ray lens shader — renders wireframe inside a circular screen-space region
	const xrayVertexShader = `
		varying vec4 vScreenPos;
		void main() {
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * mvPosition;
			vScreenPos = gl_Position;
		}
	`;
	const xrayFragmentShader = `
		uniform vec2 uCursor;
		uniform float uRadius;
		uniform vec2 uResolution;
		varying vec4 vScreenPos;
		void main() {
			// Convert clip space to screen pixels
			vec2 ndc = vScreenPos.xy / vScreenPos.w;
			vec2 screenPx = (ndc * 0.5 + 0.5) * uResolution;
			vec2 cursorPx = uCursor * uResolution;
			float dist = distance(screenPx, cursorPx);
			if (dist > uRadius) discard;
			// Fade at edge of lens
			float alpha = 1.0 - smoothstep(uRadius * 0.7, uRadius, dist);
			gl_FragColor = vec4(0.992, 0.298, 0.18, alpha * 0.35);
		}
	`;

	// Keep track of active xray materials so we can update uniforms each frame
	let xrayMaterials: ShaderMaterial[] = [];
	let xrayScene: Group | null = $state(null);

	// Modify scene topology whenever model or x-ray mode updates
	$effect(() => {
		if ($gltf) {
			hasAnimations = $gltf.animations && $gltf.animations.length > 0;

			// 0. Auto-Scale and Auto-Center
			console.log("Original GLTF Scene:", $gltf.scene);
		
		// Reset any previous scale incase reactive triggers multiple times
		$gltf.scene.scale.set(1, 1, 1);
		$gltf.scene.position.set(0, 0, 0);
		
		$gltf.scene.updateMatrixWorld(true);

		const box = new Box3().setFromObject($gltf.scene);
		const size = new Vector3();
		box.getSize(size);
		const maxDim = Math.max(size.x, size.y, size.z);
		
		console.log("Bounding Box Size:", size);
		console.log("Max Dimension:", maxDim);
		
		if (maxDim > 0 && maxDim !== Infinity) {
			const targetSize = 4; // Normalize the model to exactly 4 units across
			const scaleFactor = targetSize / maxDim;
			console.log("Scale Factor Applied:", scaleFactor);
			$gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
		}

		$gltf.scene.updateMatrixWorld(true);

		// Recalculate physical bounds after scaling to perfectly center it
		const scaledBox = new Box3().setFromObject($gltf.scene);
		const center = new Vector3();
		scaledBox.getCenter(center);
		console.log("Mathematical Center:", center);
		
		// Move its mathematical center to the origin point
		$gltf.scene.position.set(-center.x, -center.y, -center.z);

		$gltf.scene.traverse((child: Object3D) => {
			if ((child as Mesh).isMesh) {
				const mesh = child as Mesh;
				
				// 1. Initial configuration block
				if (!mesh.userData.origMat) {
					// Store raw material
					mesh.userData.origMat = mesh.material;

					// Compute logical center of the mesh for physics interaction
					if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
					
					if (mesh.geometry.boundingBox) {
						const meshCenter = new Vector3();
						mesh.geometry.boundingBox.getCenter(meshCenter);
						meshCenter.applyMatrix4(mesh.matrixWorld);

						mesh.userData.explodeDir = meshCenter.clone().normalize();
					} else {
						mesh.userData.explodeDir = new Vector3(0, 1, 0);
					}
					
					// Fallback if mesh is perfectly centered at zero
					if (mesh.userData.explodeDir.lengthSq() === 0) {
						mesh.userData.explodeDir.set(0, 1, 0); 
					}
					mesh.userData.origPos = mesh.position.clone();
				}
			}
		});
		}
	});

	$effect(() => {
		const gltfData = $gltf;
		
		if (!gltfData) return;

		// Clone the scene for the x-ray overlay (shares geometry buffers, lightweight)
		const clone = gltfData.scene.clone(true);
		xrayMaterials = [];
		clone.traverse((child: Object3D) => {
			if ((child as Mesh).isMesh) {
				const mesh = child as Mesh;
				// Disable raycasting on overlay meshes
				mesh.raycast = () => {};
				const mat = new ShaderMaterial({
					vertexShader: xrayVertexShader,
					fragmentShader: xrayFragmentShader,
					wireframe: true,
					transparent: true,
					depthWrite: false,
					uniforms: {
						uCursor: { value: new Vector2(cursorPos.x, 1.0 - cursorPos.y) },
						uRadius: { value: xrayLensRadius },
						uResolution: { value: new Vector2(1, 1) }
					}
				});
				mesh.material = mat;
				xrayMaterials.push(mat);
			}
		});
		xrayScene = clone;
	});

	// Physics and state triggers
	function handlePointerEnter() {
		if (hasAnimations) {
			if (mixer) mixer.timeScale = 1;
			for (const key in $actions) {
				$actions[key]?.play();
			}
		} else {
			// explodeSpring.set(0.01);
		}
	}

	function handlePointerLeave() {
		if (hasAnimations) {
			for (const key in $actions) {
				$actions[key]?.fadeOut(0.5);
			}
		} else {
			// explodeSpring.set(0);
		}
	}

	// Continuous event loop
	useTask((delta) => {
		// Update x-ray lens uniforms every frame to follow cursor
		if (xrayMaterials.length > 0 && renderer) {
			const size = renderer.getSize(new Vector2());
			for (const mat of xrayMaterials) {
				mat.uniforms.uCursor.value.set(cursorPos.x, 1.0 - cursorPos.y);
				mat.uniforms.uRadius.value = xrayLensRadius;
				mat.uniforms.uResolution.value.copy(size);
			}
		}

		if (!$gltf || hasAnimations) return;

		// Move components iteratively according to physical spring
		$gltf.scene.traverse((child: Object3D) => {
			if ((child as Mesh).isMesh && child.userData.origPos && child.userData.explodeDir) {
				const offset = child.userData.explodeDir.clone().multiplyScalar($explodeSpring * 1.5);
				child.position.copy(child.userData.origPos).add(offset);
			}
		});
	});
</script>

<T.PerspectiveCamera makeDefault position={[5, 4, 5]} fov={40}>
	<OrbitControls 
		autoRotate 
		autoRotateSpeed={0.5} 
		enablePan={false} 
		enableDamping 
		dampingFactor={0.05} 
		minDistance={1} 
		maxDistance={10} 
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.8} />
<T.DirectionalLight position={[10, 10, 5]} intensity={2.0} />
<T.DirectionalLight position={[-10, 10, -5]} intensity={1.0} />
<T.PointLight position={[0, -10, 0]} intensity={0.5} />

<!-- Debug Helpers (Grid) -->
<!-- <T.GridHelper args={[10, 10, 0xFD4C2E, 0x64748B]} position={[0, -0.01, 0]} /> -->

<!-- Only render the scene tree once loaded -->
{#if $gltf}
	<T.Group position={[0, 0, 0]}>
		<T is={$gltf.scene} 
			onpointerenter={handlePointerEnter}
			onpointerleave={handlePointerLeave} 
		/>

		<!-- X-Ray lens overlay (cloned scene with wireframe shader) -->
		{#if xrayScene}
			<T is={xrayScene} />
		{/if}
		
		<ContactShadows scale={10} blur={2} far={2.5} opacity={0.4} y={-0.01} />
		
		<!-- Hotspot Annotations overlay -->
		{#each hotspots as hs}
			<HTML position={hs.position} center>
				<div class="hotspot-root relative flex items-center justify-center pointer-events-none w-12 h-12">
					<!-- Pulsing node (always visible, hoverable) -->
					<div class="w-3 h-3 bg-accent rounded-full animate-ping absolute opacity-80"></div>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="w-4 h-4 rounded-full absolute z-10 pointer-events-auto cursor-pointer flex items-center justify-center"
						onmouseenter={(e) => e.currentTarget.closest('.hotspot-root')?.classList.add('is-hovered')}
						onmouseleave={(e) => e.currentTarget.closest('.hotspot-root')?.classList.remove('is-hovered')}>
						<div class="w-2 h-2 bg-accent rounded-full border border-surface"></div>
					</div>

					<!-- Expandable technical data card -->
					<div class="hotspot-card absolute left-10 top-1/2 -translate-y-1/2 border border-accent/40 bg-surface/95 backdrop-blur-md p-3 w-56 transition-all duration-300 pointer-events-none shadow-lg opacity-0 translate-x-2 z-20">
						<div class="font-mono text-[10px] text-accent font-bold uppercase border-b border-accent/20 pb-1 mb-2 tracking-widest">{hs.label}</div>
						<div class="font-sans text-xs text-primary leading-relaxed">{hs.description}</div>
					</div>
					
					<!-- Connection line to UI card -->
					<div class="hotspot-line absolute left-2 top-1/2 w-8 h-px bg-accent/40 transition-opacity opacity-0"></div>
				</div>
			</HTML>
		{/each}
	</T.Group>
{/if}

<style>
	:global(.hotspot-root.is-hovered .hotspot-card) {
		opacity: 1;
		/* transform: translateY(-50%) translateX(0); */
	}
	:global(.hotspot-root.is-hovered .hotspot-line) {
		opacity: 1;
	}
</style>


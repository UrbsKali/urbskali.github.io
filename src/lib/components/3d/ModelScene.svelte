<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, ContactShadows, HTML, interactivity, useGltf, useGltfAnimations } from '@threlte/extras';
	import { cubicOut } from 'svelte/easing';
	import { spring, Tween } from 'svelte/motion';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	import { Box3, DoubleSide, Group, Mesh, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, Vector3, type Object3D, type Texture } from 'three';
	import type { ProjectHotspot } from '$lib/types';

	// Enable Raycasting for hover events within Threlte
	interactivity();

	let { url, cursorPos = { x: 0, y: 0 }, xrayLensRadius = 120, hotspots = [], imageUrls = [], loaded = $bindable(false) }: { 
		url: string; 
		cursorPos?: { x: number; y: number };
		xrayLensRadius?: number;
		hotspots?: ProjectHotspot[];
		imageUrls?: string[];
		loaded?: boolean;
	} = $props();

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

	// Hook-based loading gives us full access to the logical 3D tree
	const gltf = useGltf(url, { dracoLoader });

	$effect(() => {
		loaded = !!$gltf;
	});
	const { actions, mixer } = useGltfAnimations(gltf);
	const { renderer } = useThrelte();

	let hasAnimations = false;
	const explodeSpring = spring(0, { stiffness: 0.08, damping: 0.35 });
	const modelSlideX = new Tween(0, { duration: 380, easing: cubicOut });
	const MODEL_SLIDE_DURATION = 380;
	const MODEL_SLIDE_OFFSET = 1;

	// X-ray lens shader — uses gl_FragCoord to keep fragment math minimal.
	const xrayVertexShader = `
		void main() {
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;
	const xrayFragmentShader = `
		uniform vec2 uCursorPx;
		uniform float uRadiusPx;
		void main() {
			vec2 delta = gl_FragCoord.xy - uCursorPx;
			float dist2 = dot(delta, delta);
			float radius2 = uRadiusPx * uRadiusPx;
			if (dist2 > radius2) discard;
			float alpha = 1.0 - smoothstep(radius2 * 0.49, radius2, dist2);
			gl_FragColor = vec4(0.992, 0.298, 0.18, alpha * 0.35);
		}
	`;

	const lensViewportCss = new Vector2(1, 1);
	const lensViewportBuffer = new Vector2(1, 1);
	let lensPixelScale = 1;
	const xrayUniforms = {
		uCursorPx: { value: new Vector2(-10_000, -10_000) },
		uRadiusPx: { value: 120 }
	};
	const sharedXrayMaterial = new ShaderMaterial({
		vertexShader: xrayVertexShader,
		fragmentShader: xrayFragmentShader,
		wireframe: true,
		transparent: true,
		depthWrite: false,
		uniforms: xrayUniforms
	});
	sharedXrayMaterial.toneMapped = false;

	let xrayScene: Group | null = $state(null);
	let imageTextures: Texture[] = $state([]);
	let activeImageTextures: Texture[] = [];
	let explodableMeshes: Mesh[] = [];
	const explodeOffset = new Vector3();
	const modelSlideCurrent = $derived(Math.abs(modelSlideX.current) < 0.0001 ? 0 : modelSlideX.current);

	function updateLensViewport() {
		if (!renderer) return;
		renderer.getSize(lensViewportCss);
		renderer.getDrawingBufferSize(lensViewportBuffer);

		if (lensViewportCss.x <= 0 || lensViewportCss.y <= 0) {
			lensViewportCss.set(1, 1);
		}
		if (lensViewportBuffer.x <= 0 || lensViewportBuffer.y <= 0) {
			lensViewportBuffer.copy(lensViewportCss);
		}

		lensPixelScale = lensViewportBuffer.x / lensViewportCss.x;
		if (!Number.isFinite(lensPixelScale) || lensPixelScale <= 0) {
			lensPixelScale = 1;
		}
	}

	function replaceImageTextures(nextTextures: Texture[]) {
		for (const texture of activeImageTextures) {
			texture.dispose();
		}
		activeImageTextures = nextTextures;
		imageTextures = nextTextures;
	}

	function clearImageTextures() {
		replaceImageTextures([]);
	}

	$effect(() => {
		url;

		if (typeof window === 'undefined') {
			modelSlideX.target = 0;
			return;
		}

		modelSlideX.target = MODEL_SLIDE_OFFSET;

		const rafId = window.requestAnimationFrame(() => {
			void modelSlideX.set(0, { duration: MODEL_SLIDE_DURATION, easing: cubicOut });
		});

		const settleId = window.setTimeout(() => {
			modelSlideX.target = 0;
		}, MODEL_SLIDE_DURATION + 40);

		return () => {
			window.cancelAnimationFrame(rafId);
			window.clearTimeout(settleId);
		};
	});

	$effect(() => {
		const urls = imageUrls.filter((imageUrl) => imageUrl.length > 0);

		if (urls.length === 0) {
			clearImageTextures();
			return;
		}

		let cancelled = false;
		const loader = new TextureLoader();

		Promise.all(
			urls.map(
				(src) =>
					new Promise<Texture>((resolve, reject) => {
						loader.load(
							src,
							(texture) => {
								texture.colorSpace = SRGBColorSpace;
								resolve(texture);
							},
							undefined,
							(err) => reject(err)
						);
					})
			)
		)
			.then((textures) => {
				if (cancelled) {
					for (const texture of textures) {
						texture.dispose();
					}
					return;
				}

				replaceImageTextures(textures);
			})
			.catch((err) => {
				if (cancelled) return;
				console.error('Failed to load project image textures:', err);
				clearImageTextures();
			});

		return () => {
			cancelled = true;
		};
	});

	// Modify scene topology whenever model or x-ray mode updates
	$effect(() => {
		const gltfData = $gltf;
		if (!gltfData) {
			explodableMeshes = [];
			return;
		}

		hasAnimations = gltfData.animations.length > 0;

		// Reset any previous transforms before auto-fit.
		gltfData.scene.scale.set(1, 1, 1);
		gltfData.scene.position.set(0, 0, 0);
		gltfData.scene.updateMatrixWorld(true);

		const box = new Box3().setFromObject(gltfData.scene);
		const size = new Vector3();
		box.getSize(size);
		const maxDim = Math.max(size.x, size.y, size.z);

		if (maxDim > 0 && Number.isFinite(maxDim)) {
			const targetSize = 4;
			const scaleFactor = targetSize / maxDim;
			gltfData.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
		}

		gltfData.scene.updateMatrixWorld(true);

		const scaledBox = new Box3().setFromObject(gltfData.scene);
		const center = new Vector3();
		scaledBox.getCenter(center);
		gltfData.scene.position.set(-center.x, -center.y, -center.z);
		gltfData.scene.updateMatrixWorld(true);

		explodableMeshes = [];
		const meshCenter = new Vector3();
		gltfData.scene.traverse((child: Object3D) => {
			if (!(child as Mesh).isMesh) return;

			const mesh = child as Mesh;
			if (!mesh.userData.origMat) {
				mesh.userData.origMat = mesh.material;
			}

			if (!mesh.geometry.boundingBox) {
				mesh.geometry.computeBoundingBox();
			}

			if (mesh.geometry.boundingBox) {
				mesh.geometry.boundingBox.getCenter(meshCenter);
				meshCenter.applyMatrix4(mesh.matrixWorld);
				if (meshCenter.lengthSq() > 0) {
					mesh.userData.explodeDir = meshCenter.clone().normalize();
				} else {
					mesh.userData.explodeDir = new Vector3(0, 1, 0);
				}
			} else {
				mesh.userData.explodeDir = new Vector3(0, 1, 0);
			}

			mesh.userData.origPos = mesh.position.clone();
			explodableMeshes.push(mesh);
		});
	});

	$effect(() => {
		const gltfData = $gltf;
		
		if (!gltfData) {
			xrayScene = null;
			return;
		}

		// Clone the scene for the x-ray overlay (shares geometry buffers, lightweight)
		const clone = gltfData.scene.clone(true);
		clone.traverse((child: Object3D) => {
			if ((child as Mesh).isMesh) {
				const mesh = child as Mesh;
				// Disable raycasting on overlay meshes
				mesh.raycast = () => {};
				mesh.material = sharedXrayMaterial;
			}
		});
		xrayScene = clone;
	});

	$effect(() => {
		if (!renderer || typeof window === 'undefined') return;

		updateLensViewport();
		const resizeObserver = new ResizeObserver(() => {
			updateLensViewport();
		});
		resizeObserver.observe(renderer.domElement);

		return () => {
			resizeObserver.disconnect();
		};
	});

	$effect(() => {
		return () => {
			clearImageTextures();
			sharedXrayMaterial.dispose();
		};
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
	useTask(() => {
		if (renderer) {
			xrayUniforms.uCursorPx.value.set(cursorPos.x * lensViewportBuffer.x, (1.0 - cursorPos.y) * lensViewportBuffer.y);
			xrayUniforms.uRadiusPx.value = xrayLensRadius * lensPixelScale;
		}

		if (!$gltf || hasAnimations || explodableMeshes.length === 0 || Math.abs($explodeSpring) < 0.0001) return;

		const springOffset = $explodeSpring * 1.5;

		for (const mesh of explodableMeshes) {
			const origPos = mesh.userData.origPos as Vector3 | undefined;
			const explodeDir = mesh.userData.explodeDir as Vector3 | undefined;
			if (!origPos || !explodeDir) continue;

			explodeOffset.copy(explodeDir).multiplyScalar(springOffset);
			mesh.position.copy(origPos).add(explodeOffset);
		}
	});

	function getTextureAspect(texture: Texture) {
		const image = texture.image as { width?: number; height?: number } | null;
		if (!image?.width || !image?.height) return 1.35;
		return image.width / image.height;
	}
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
	<T.Group position={[modelSlideCurrent * 2.2, 0, 0]}>
		<T is={$gltf.scene} 
			onpointerenter={handlePointerEnter}
			onpointerleave={handlePointerLeave} 
		/>

		<!-- X-Ray lens overlay (cloned scene with wireframe shader) -->
		{#if xrayScene}
			<T is={xrayScene} />
		{/if}

		{#each imageTextures as texture, index}
			{@const imageCount = imageTextures.length}
			{@const angle = (index / imageCount) * Math.PI * 2}
			{@const y = (index % 2) * 0.55 - 0.2}
			{@const aspect = getTextureAspect(texture)}
			{@const planeHeight = 0.85}
			{@const planeWidth = planeHeight * aspect}

			<T.Group position={[Math.cos(angle) * 3.1, y, Math.sin(angle) * 3.1]} rotation={[0.04, -angle + Math.PI / 2, 0]}>
				<T.Mesh position={[0, 0, -0.02]}>
					<T.PlaneGeometry args={[planeWidth + 0.1, planeHeight + 0.1]} />
					<T.MeshStandardMaterial color="#e5e7eb" roughness={0.82} metalness={0.06} />
				</T.Mesh>
				<T.Mesh>
					<T.PlaneGeometry args={[planeWidth, planeHeight]} />
					<T.MeshBasicMaterial map={texture} transparent={true} toneMapped={false} side={DoubleSide} />
				</T.Mesh>
			</T.Group>
		{/each}
		
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


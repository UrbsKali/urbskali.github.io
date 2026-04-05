<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { DoubleSide, SRGBColorSpace, TextureLoader, Color, type Texture, ShaderMaterial, Vector2 } from 'three';

	let { imageUrls = [] }: { imageUrls?: string[] } = $props();

	let imageTextures: Texture[] = $state([]);

	$effect(() => {
		const urls = imageUrls.filter((url) => url.length > 0);

		if (urls.length === 0) {
			imageTextures = [];
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
				if (cancelled) return;
				imageTextures = textures;
			})
			.catch((err) => {
				if (cancelled) return;
				console.error('Failed to load image textures:', err);
				imageTextures = [];
			});

		return () => {
			cancelled = true;
		};
	});

	function getTextureAspect(texture: Texture) {
		const image = texture.image as { width?: number; height?: number } | null;
		if (!image?.width || !image?.height) return 1.35;
		return image.width / image.height;
	}

	// Removed: Shader-based neon border now replaced with 3D frame geometry

</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 4]} fov={42}>
	<OrbitControls 
		enablePan={false} 
		enableDamping 
		dampingFactor={0.06} 
		minDistance={2} 
		maxDistance={9}
		minPolarAngle={Math.PI * 0.2}
		maxPolarAngle={Math.PI * 0.8}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={1.0} />
<T.DirectionalLight position={[5, 6, 4]} intensity={1.4} />
<T.DirectionalLight position={[-4, 3, -5]} intensity={0.8} />

{#each imageTextures as texture, index}
	{@const aspect = getTextureAspect(texture)}
	{@const planeHeight = 2.2}
	{@const planeWidth = planeHeight * aspect}
	{@const offsetX = (index - (imageTextures.length - 1) / 2) * (planeWidth + 0.15)}
	{@const frameThickness = 0.12}
	{@const frameDepth = 0.15}
	{@const neonAccent = new Color('#FD4C2E')}

	<T.Group position={[offsetX, 0, 0]}>
		<!-- Image plane -->
		<T.Mesh position={[0, 0, 0.01]}>
			<T.PlaneGeometry args={[planeWidth, planeHeight]} />
			<T.MeshBasicMaterial map={texture} transparent={true} toneMapped={false} side={DoubleSide} />
		</T.Mesh>

		<!-- 3D Frame: Top border -->
		<T.Mesh position={[0, planeHeight / 2 + frameThickness / 2, 0]}>
			<T.BoxGeometry args={[planeWidth + frameThickness * 2, frameThickness, frameDepth]} />
			<T.MeshStandardMaterial 
				color={neonAccent}
				roughness={0.6}
				metalness={0.4}
				emissive={neonAccent}
				emissiveIntensity={0.2}
			/>
		</T.Mesh>

		<!-- 3D Frame: Bottom border -->
		<T.Mesh position={[0, -planeHeight / 2 - frameThickness / 2, 0]}>
			<T.BoxGeometry args={[planeWidth + frameThickness * 2, frameThickness, frameDepth]} />
			<T.MeshStandardMaterial 
				color={neonAccent}
				roughness={0.6}
				metalness={0.4}
				emissive={neonAccent}
				emissiveIntensity={0.2}
			/>
		</T.Mesh>

		<!-- 3D Frame: Left border -->
		<T.Mesh position={[-planeWidth / 2 - frameThickness / 2, 0, 0]}>
			<T.BoxGeometry args={[frameThickness, planeHeight + frameThickness * 2, frameDepth]} />
			<T.MeshStandardMaterial 
				color={neonAccent}
				roughness={0.6}
				metalness={0.4}
				emissive={neonAccent}
				emissiveIntensity={0.2}
			/>
		</T.Mesh>

		<!-- 3D Frame: Right border -->
		<T.Mesh position={[planeWidth / 2 + frameThickness / 2, 0, 0]}>
			<T.BoxGeometry args={[frameThickness, planeHeight + frameThickness * 2, frameDepth]} />
			<T.MeshStandardMaterial 
				color={neonAccent}
				roughness={0.6}
				metalness={0.4}
				emissive={neonAccent}
				emissiveIntensity={0.2}
			/>
		</T.Mesh>

		<!-- 3D Frame: Back support layer for depth -->
		<T.Mesh position={[0, 0, -frameDepth / 2 - 0.02]}>
			<T.BoxGeometry args={[planeWidth + frameThickness * 1.5, planeHeight + frameThickness * 1.5, 0.04]} />
			<T.MeshStandardMaterial 
				color="#1a1a2e"
				roughness={0.8}
				metalness={0.1}
				emissive="#0d1b2a"
				emissiveIntensity={0.15}
			/>
		</T.Mesh>
	</T.Group>
{/each}

{#if imageTextures.length === 0}
	<T.Mesh>
		<T.BoxGeometry args={[1.2, 1.2, 1.2]} />
		<T.MeshStandardMaterial 
			color="#cbd5e1" 
			wireframe={true}
			emissive="#16a34a"
			emissiveIntensity={0.3}
		/>
	</T.Mesh>
{/if}

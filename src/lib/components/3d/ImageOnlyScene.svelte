<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { DoubleSide, SRGBColorSpace, TextureLoader, type Texture } from 'three';

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
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 4]} fov={42}>
	<OrbitControls enablePan={false} enableDamping dampingFactor={0.06} minDistance={2} maxDistance={9} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1.0} />
<T.DirectionalLight position={[5, 6, 4]} intensity={1.4} />
<T.DirectionalLight position={[-4, 3, -5]} intensity={0.8} />

{#each imageTextures as texture, index}
	{@const aspect = getTextureAspect(texture)}
	{@const planeHeight = 2.2}
	{@const planeWidth = planeHeight * aspect}
	{@const offsetX = (index - (imageTextures.length - 1) / 2) * (planeWidth + 0.15)}

	<T.Group position={[offsetX, 0, 0]}>
		<T.Mesh position={[0, 0, -0.02]}>
			<T.PlaneGeometry args={[planeWidth + 0.12, planeHeight + 0.12]} />
			<T.MeshStandardMaterial color="#e5e7eb" roughness={0.9} metalness={0.05} />
		</T.Mesh>
		<T.Mesh>
			<T.PlaneGeometry args={[planeWidth, planeHeight]} />
			<T.MeshBasicMaterial map={texture} transparent={true} toneMapped={false} side={DoubleSide} />
		</T.Mesh>
	</T.Group>
{/each}

{#if imageTextures.length === 0}
	<T.Mesh>
		<T.BoxGeometry args={[1.2, 1.2, 1.2]} />
		<T.MeshStandardMaterial color="#cbd5e1" wireframe={true} />
	</T.Mesh>
{/if}

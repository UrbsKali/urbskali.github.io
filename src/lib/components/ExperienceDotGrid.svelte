<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import type { ExperienceIcon } from '$lib/data/experiences';

	let { activeIcon }: { activeIcon: ExperienceIcon } = $props();

	const groupPixels = [
			'000010000',
			'000111000',
			'000111000',
			'010111010',
			'011111110',
			'111111111',
			'111111111',
			'011111110',
			'001111100'
		];
	const bookPixels = [
			'000000000',
			'011000110',
			'010100010',
			'010100010',
			'010111010',
			'010100010',
			'010100010',
			'011000110',
			'000000000'
		];
	const chipPixels = [
			'000010000',
			'000010000',
			'001111100',
			'011000110',
			'111000111',
			'011000110',
			'001111100',
			'000010000',
			'000010000'
		];
	const crownPixels = [
		'000010000',
		'010101010',
		'011111110',
		'111111111',
		'011111110',
		'001111100',
		'001111100',
		'011111110',
		'000000000'
	];
	const robotPixels = [
		'000010000',
		'001111100',
		'011111110',
		'010101010',
		'011111110',
		'001111100',
		'011111110',
		'010000010',
		'011111110'
	];
	const iconPixels: Record<ExperienceIcon, string[]> = {
		leadership: groupPixels,
		education: bookPixels,
		engineering: chipPixels,
		crown: crownPixels,
		book: bookPixels,
		robot: robotPixels
	};

	let dotVisual: HTMLDivElement;
	let prefersReducedMotion = $state(false);
	let dotGrid = $state({ x: 0, y: 0, size: 24, grayRadius: 1.5, radius: 3.5 });

	onMount(() => {
		const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updateMotionPreference = () => (prefersReducedMotion = motionPreference.matches);
		updateMotionPreference();
		motionPreference.addEventListener('change', updateMotionPreference);

		const updateGridAlignment = () => {
			const bounds = dotVisual.getBoundingClientRect();
			const styles = getComputedStyle(dotVisual);
			const size = Number.parseFloat(styles.getPropertyValue('--dot-grid-size')) || 24;
			const grayRadius = Number.parseFloat(styles.getPropertyValue('--dot-grid-radius')) || 1.5;
			const radius = grayRadius + 2;
			const layerLeft = bounds.left + (bounds.width - 256) / 2;
			const layerTop = bounds.top + (bounds.height - 256) / 2;
			const phaseX = ((size / 2 - (layerLeft % size)) % size + size) % size;
			const phaseY = ((size / 2 - (layerTop % size)) % size + size) % size;

			dotGrid = {
				x: phaseX + (Math.round((128 - phaseX) / size) - 4) * size,
				y: phaseY + (Math.round((128 - phaseY) / size) - 4) * size,
				size,
				grayRadius,
				radius
			};
		};

		updateGridAlignment();
		window.addEventListener('resize', updateGridAlignment);
		window.addEventListener('scroll', updateGridAlignment, { passive: true });

		return () => {
			motionPreference.removeEventListener('change', updateMotionPreference);
			window.removeEventListener('resize', updateGridAlignment);
			window.removeEventListener('scroll', updateGridAlignment);
		};
	});
</script>

<div class="dot-visual" bind:this={dotVisual} aria-hidden="true">
	{#key activeIcon}
		<svg
			class="dot-layer"
			viewBox="0 0 256 256"
			width="256"
			height="256"
		>
			{#each iconPixels[activeIcon] as row, rowIndex}
				{#each [...row] as pixel, columnIndex}
					{#if pixel === '1'}
						<circle
							cx={dotGrid.x + columnIndex * dotGrid.size}
							cy={dotGrid.y + rowIndex * dotGrid.size}
							r={dotGrid.radius}
							fill="var(--color-accent)"
							in:scale={{ start: dotGrid.grayRadius / dotGrid.radius, duration: prefersReducedMotion ? 0 : 220 }}
							out:scale={{ start: dotGrid.grayRadius / dotGrid.radius, duration: prefersReducedMotion ? 0 : 180 }}
						/>
					{/if}
				{/each}
			{/each}
		</svg>
	{/key}

</div>

<style>
	.dot-visual {
		position: absolute;
		inset: 0;
		overflow: visible;
	}

	.dot-visual::before {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(#70757d var(--dot-grid-radius), transparent calc(var(--dot-grid-radius) + 0.1px));
		background-attachment: fixed;
		background-size: var(--dot-grid-size) var(--dot-grid-size);
		mask-image: radial-gradient(ellipse 64% 72% at center, #000 0%, rgb(0 0 0 / 0.48) 48%, transparent 100%);
		opacity: 0.95;
		content: '';
		pointer-events: none;
	}

	.dot-layer {
		position: absolute;
		top: calc(50% - 128px);
		left: calc(50% - 128px);
		width: 256px;
		aspect-ratio: 1;
		overflow: visible;
	}

	.dot-layer circle {
		transform-box: fill-box;
		transform-origin: center;
	}
</style>
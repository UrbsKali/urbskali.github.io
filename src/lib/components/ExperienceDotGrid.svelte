<script lang="ts">
	import { onMount } from 'svelte';
	import type { ExperienceIcon } from '$lib/data/experiences';

	let { activeIcon }: { activeIcon: ExperienceIcon } = $props();

	const icons = ['leadership', 'education', 'engineering', 'crown', 'book', 'robot'] as const;
	const iconGridSize = 11;
	const iconPixels: Record<ExperienceIcon, string[]> = {
		leadership: [
			'00000100000',
			'00011111000',
			'00111111100',
			'00111111100',
			'00011111000',
			'00001110000',
			'00111111100',
			'01111111110',
			'11111111111',
			'01111111110',
			'00111111100'
		],
		education: [
			'00000100000',
			'00001110000',
			'00011111000',
			'00111111100',
			'01111111110',
			'11100100111',
			'00100000100',
			'00100000100',
			'00111111100',
			'00011111000',
			'00000000000'
		],
		engineering: [
			'00000100000',
			'00000100000',
			'00100100100',
			'00011111000',
			'00111111100',
			'01110101110',
			'01110101110',
			'00111111100',
			'00011111000',
			'00000100000',
			'00000100000'
		],
		crown: [
			'00000000000',
			'01000000010',
			'01100000110',
			'01110001110',
			'01101010110',
			'01101110110',
			'01111111110',
			'01111111110',
			'11111111111',
			'11111111111',
			'00000000000'
		],
		book: [
			'00000000000',
			'00111111110',
			'01111111111',
			'01100000011',
			'01100000011',
			'01100000011',
			'01100000011',
			'01100000011',
			'01111111111',
			'00111111110',
			'00000000000'
		],
		robot: [
			'00000100000',
			'00000100000',
			'00000100000',
			'00111111100',
			'01111111110',
			'01101010110',
			'01111111110',
			'01100100110',
			'00111111100',
			'00010001000',
			'00100000100'
		]
	};

	let dotVisual: HTMLDivElement;
	let dotGrid = $state({ x: 0, y: 0, size: 24, radius: 1.5 });

	onMount(() => {
		const updateGridAlignment = () => {
			const bounds = dotVisual.getBoundingClientRect();
			const styles = getComputedStyle(dotVisual);
			const size = Number.parseFloat(styles.getPropertyValue('--dot-grid-size')) || 24;
			const radius = Number.parseFloat(styles.getPropertyValue('--dot-grid-radius')) || 1.5;
			const layerLeft = bounds.left + (bounds.width - 256) / 2;
			const layerTop = bounds.top + (bounds.height - 256) / 2;
			const phaseX = ((size / 2 - (layerLeft % size)) % size + size) % size;
			const phaseY = ((size / 2 - (layerTop % size)) % size + size) % size;
			const gridOffset = (iconGridSize - 1) / 2;

			dotGrid = {
				x: phaseX + (Math.round((128 - phaseX) / size) - gridOffset) * size,
				y: phaseY + (Math.round((128 - phaseY) / size) - gridOffset) * size,
				size,
				radius
			};
		};

		updateGridAlignment();
		window.addEventListener('resize', updateGridAlignment);
		window.addEventListener('scroll', updateGridAlignment, { passive: true });

		return () => {
			window.removeEventListener('resize', updateGridAlignment);
			window.removeEventListener('scroll', updateGridAlignment);
		};
	});
</script>

<div class="dot-visual" bind:this={dotVisual} aria-hidden="true">
	{#each icons as icon}
		<svg
			class="dot-layer"
			class:active={activeIcon === icon}
			style:--layer-opacity={activeIcon === icon ? 1 : 0}
			viewBox="0 0 256 256"
			width="256"
			height="256"
		>
			{#each iconPixels[icon] as row, rowIndex}
				{#each [...row] as pixel, columnIndex}
					{#if pixel === '1'}
						<circle
							cx={dotGrid.x + columnIndex * dotGrid.size}
							cy={dotGrid.y + rowIndex * dotGrid.size}
							r={dotGrid.radius}
							fill="var(--color-accent)"
						/>
					{/if}
				{/each}
			{/each}
		</svg>
	{/each}

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
		opacity: var(--layer-opacity);
		transition: opacity 220ms ease-out;
	}

	.dot-layer circle {
		transform-box: fill-box;
		transform-origin: center;
		transform: scale(1);
		transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.dot-layer.active circle {
		transform: scale(2.33);
	}

	@media (prefers-reduced-motion: reduce) {
		.dot-layer {
			transition: none;
		}

		.dot-layer circle {
			transition: none;
		}
	}
</style>
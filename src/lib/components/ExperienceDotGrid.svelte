<script lang="ts">
	import type { ExperienceIcon } from '$lib/data/experiences';

	let {
		activeIcon,
		prefersReducedMotion
	}: {
		activeIcon: ExperienceIcon;
		prefersReducedMotion: boolean;
	} = $props();

	const icons = ['leadership', 'education', 'engineering'] as const;
</script>

<div class="dot-visual" aria-hidden="true">
	<svg class="mask-definitions" width="0" height="0" aria-hidden="true">
		<defs>
			<mask id="leadership-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">
				<rect width="256" height="256" fill="black" />
				<g
					transform="scale(2)"
					fill="none"
					stroke="white"
					stroke-width="10"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="64" cy="39" r="13" />
					<circle cx="31" cy="48" r="9" />
					<circle cx="97" cy="48" r="9" />
					<path d="M39 93c0-15 11-27 25-27s25 12 25 27v8H39v-8Z" />
					<path d="M15 94c0-12 7-21 17-22m81 22c0-12-7-21-17-22M48 108h32" />
				</g>
			</mask>
			<mask id="education-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">
				<rect width="256" height="256" fill="black" />
				<g
					transform="scale(2)"
					fill="none"
					stroke="white"
					stroke-width="10"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M17 29c18-6 33-3 47 7v72c-14-10-29-13-47-7V29Z" />
					<path d="M111 29c-18-6-33-3-47 7v72c14-10 29-13 47-7V29Z" />
					<path d="M29 46c8-1 15 0 22 4m-22 10c8-1 15 0 22 4m26-14c7-4 14-5 22-4M77 64c7-4 14-5 22-4" />
				</g>
			</mask>
			<mask id="engineering-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">
				<rect width="256" height="256" fill="black" />
				<g
					transform="scale(2)"
					fill="none"
					stroke="white"
					stroke-width="10"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="37" y="37" width="54" height="54" rx="5" />
					<rect x="51" y="51" width="26" height="26" rx="2" />
					<path d="M48 24v13m16-13v13m16-13v13M48 91v13m16-13v13m16-13v13M24 48h13m-13 16h13m-13 16h13m54-32h13m-13 16h13m-13 16h13" />
					<path d="m58 64 5 5 9-11" />
				</g>
			</mask>
		</defs>
	</svg>

	{#each icons as icon}
		<div
			class="dot-layer"
			class:still={prefersReducedMotion}
			style:mask-image={`url(#${icon}-mask)`}
			style:--layer-opacity={activeIcon === icon ? 1 : 0}
		></div>
	{/each}

	<svg class="icon-outline" viewBox="0 0 256 256" fill="none" aria-hidden="true">
		<g
			transform="scale(2)"
			stroke="currentColor"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			{#if activeIcon === 'leadership'}
				<circle cx="64" cy="39" r="13" />
				<circle cx="31" cy="48" r="9" />
				<circle cx="97" cy="48" r="9" />
				<path d="M39 93c0-15 11-27 25-27s25 12 25 27v8H39v-8Z" />
				<path d="M15 94c0-12 7-21 17-22m81 22c0-12-7-21-17-22M48 108h32" />
			{:else if activeIcon === 'education'}
				<path d="M17 29c18-6 33-3 47 7v72c-14-10-29-13-47-7V29Z" />
				<path d="M111 29c-18-6-33-3-47 7v72c14-10 29-13 47-7V29Z" />
				<path d="M29 46c8-1 15 0 22 4m-22 10c8-1 15 0 22 4m26-14c7-4 14-5 22-4M77 64c7-4 14-5 22-4" />
			{:else}
				<rect x="37" y="37" width="54" height="54" rx="5" />
				<rect x="51" y="51" width="26" height="26" rx="2" />
				<path d="M48 24v13m16-13v13m16-13v13M48 91v13m16-13v13m16-13v13M24 48h13m-13 16h13m-13 16h13m54-32h13m-13 16h13m-13 16h13" />
				<path d="m58 64 5 5 9-11" />
			{/if}
		</g>
	</svg>
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

	.icon-outline {
		position: absolute;
		top: calc(50% - 128px);
		left: calc(50% - 128px);
		z-index: 1;
		width: 256px;
		color: var(--color-accent);
		opacity: 1;
		pointer-events: none;
	}

	.mask-definitions {
		position: absolute;
		overflow: hidden;
	}

	.dot-layer {
		position: absolute;
		top: calc(50% - 128px);
		left: calc(50% - 128px);
		width: 256px;
		aspect-ratio: 1;
		background-image:
			radial-gradient(var(--color-accent) var(--dot-grid-radius), transparent calc(var(--dot-grid-radius) + 0.1px)),
			linear-gradient(to right, color-mix(in srgb, var(--color-accent) 34%, transparent) 1px, transparent 1px),
			linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 34%, transparent) 1px, transparent 1px);
		background-attachment: fixed;
		background-position: 0 0;
		background-size: var(--dot-grid-size) var(--dot-grid-size);
		opacity: var(--layer-opacity);
		mask-mode: luminance;
		mask-position: center 0;
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
		animation: mask-wave 4.8s ease-in-out infinite;
		transition: opacity 900ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.dot-layer.still {
		animation: none;
	}

	@keyframes mask-wave {
		0%,
		100% {
			mask-position: center 0;
		}
		50% {
			mask-position: center 2px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot-layer {
			animation: none;
			transition: none;
		}
	}
</style>
<script lang="ts">
	import { base } from '$app/paths';
	import { Canvas } from '@threlte/core';
	import ModelScene from './ModelScene.svelte';
	import ImageOnlyScene from './ImageOnlyScene.svelte';
	import type { Project, ProjectHotspot } from '$lib/types';
	
	let { project }: { project: Project } = $props();
	
	let cursorPos = $state({ x: 0, y: 0 });
	let containerEl: HTMLDivElement | undefined = $state();
	let xrayLensRadius = $state(60);
	let activeItemIndex = $state(0);
	let modelLoaded = $state(false);
	let isViewerHovered = $state(false);

	$effect(() => {
		// Reset loading state whenever the active model changes
		activeDeckItem;
		modelLoaded = false;
	});
	let deckHasEntered = $state(false);
	let deckWheelLocked = $state(false);
	const ROTARY_CARD_ANGLE_STEP = 5;
	const ROTARY_START_ANGLE = 180;
	const ROTARY_CENTER_OFFSET = 500;
	const ROTARY_RADIUS = 560;

	type DeckItem =
		| { kind: 'model'; url: string; modelIndex: number; label: string; itemIndex: number }
		| { kind: 'image'; url: string; imageIndex: number; label: string; itemIndex: number };

	function resolveAssetUrl(url: string) {
		if (!url.startsWith('/')) return url;
		return `${base}${url}`;
	}

	const modelUrls = $derived.by(() => {
		const multiModelUrls =
			project.models_3d?.filter((url) => url.length > 0).map((url) => resolveAssetUrl(url)) ?? [];
		if (multiModelUrls.length > 0) return multiModelUrls;
		return project.model_3d ? [resolveAssetUrl(project.model_3d)] : [];
	});

	const imageUrls = $derived((project.images ?? []).filter((url) => url.length > 0).map((url) => resolveAssetUrl(url)));

	const deckItems = $derived.by((): DeckItem[] => {
		const items: DeckItem[] = [];
		modelUrls.forEach((url, i) => {
			items.push({ kind: 'model', url, modelIndex: i, label: getModelLabel(url, i), itemIndex: items.length });
		});
		imageUrls.forEach((url, i) => {
			items.push({ kind: 'image', url, imageIndex: i, label: getImageLabel(url, i), itemIndex: items.length });
		});
		return items;
	});

	const has3DContent = $derived(deckItems.length > 0);
	const activeDeckItem = $derived(deckItems[activeItemIndex] ?? null);

	const activeHotspots = $derived.by((): ProjectHotspot[] => {
		if (!activeDeckItem || activeDeckItem.kind !== 'model') return [];
		const mi = activeDeckItem.modelIndex;
		if (project.hotspots_per_model) return project.hotspots_per_model[mi] ?? [];
		return project.hotspots ?? [];
	});

	const deckRotation = $derived.by(() => {
		if (deckItems.length < 2) return 0;
		return -ROTARY_CARD_ANGLE_STEP * activeItemIndex;
	});

	const rotaryDeck = $derived.by(() => {
		return deckItems.map((item) => {
			const angle = ROTARY_START_ANGLE + item.itemIndex * ROTARY_CARD_ANGLE_STEP;
			const radians = (angle * Math.PI) / 180;
			const x = Math.cos(radians) * ROTARY_RADIUS;
			const y = Math.sin(radians) * ROTARY_RADIUS;
			return {
				itemIndex: item.itemIndex,
				kind: item.kind,
				label: item.label,
				typeLabel: item.kind === 'model' ? `MDL ${item.modelIndex + 1}` : `IMG ${item.imageIndex + 1}`,
				channelLabel: item.kind === 'model' ? '3D View' : 'Image',
				angle,
				x,
				y
			};
		});
	});

	const deckLabel = $derived.by(() => {
		if (modelUrls.length > 0 && imageUrls.length > 0) return 'View Deck';
		if (imageUrls.length > 1) return 'Image Deck';
		return 'Model Deck';
	});

	$effect(() => {
		if (activeItemIndex >= deckItems.length) activeItemIndex = 0;
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		const rafId = window.requestAnimationFrame(() => {
			deckHasEntered = true;
		});
		return () => window.cancelAnimationFrame(rafId);
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (deckItems.length < 2) return;
		if (isViewerHovered) return;

		const intervalId = window.setInterval(() => {
			if (document.visibilityState !== 'visible') return;
			activeItemIndex = (activeItemIndex + 1) % deckItems.length;
		}, 20000);

		return () => window.clearInterval(intervalId);
	});

	function handleMouseMove(e: MouseEvent) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		cursorPos = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};
	}

	function handleViewerMouseEnter() {
		isViewerHovered = true;
	}

	function handleViewerMouseLeave() {
		isViewerHovered = false;
	}

	function cycleItem(direction: 1 | -1) {
		const total = deckItems.length;
		if (total < 2) return false;
		const nextIndex = activeItemIndex + direction;
		if (nextIndex < 0 || nextIndex >= total) return false;
		activeItemIndex = nextIndex;
		return true;
	}

	function setActiveItem(index: number) {
		activeItemIndex = index;
	}

	function getModelLabel(url: string, index: number) {
		const fromPath = url.split('/').pop() ?? `model-${index + 1}`;
		const normalized = fromPath.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
		return normalized.length > 0 ? normalized : `model ${index + 1}`;
	}

	function getImageLabel(url: string, index: number) {
		const fromPath = url.split('/').pop() ?? `image-${index + 1}`;
		const normalized = fromPath.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
		return normalized.length > 0 ? normalized : `image ${index + 1}`;
	}

	function getRotaryCardStyle(x: number, y: number, angle: number, isActiveCard: boolean) {
		return {
			style: `--deck-card-x:${x}px; --deck-card-y:${y}px; --deck-card-tilt:${angle - 180}deg; z-index:${isActiveCard ? 60 : 20};`
		};
	}

	function handleDeckWheel(e: WheelEvent) {
		e.preventDefault();
		if (deckWheelLocked) return;
		const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
		if (delta === 0) return;
		const direction: 1 | -1 = delta > 0 ? 1 : -1;
		if (!cycleItem(direction)) return;
		deckWheelLocked = true;
		setTimeout(() => {
			deckWheelLocked = false;
		}, 180);
	}
</script>

<div 
	class="w-full h-full border border-border bg-surface relative overflow-hidden group mb-12"
	role="img"
	bind:this={containerEl}
	onmousemove={handleMouseMove}
	onmouseenter={handleViewerMouseEnter}
	onmouseleave={handleViewerMouseLeave}
>
	{#if has3DContent}
		<Canvas>
			{#if activeDeckItem?.kind === 'model'}
				{#key activeDeckItem.url}
					<ModelScene
						url={activeDeckItem.url}
						cursorPos={cursorPos}
						{xrayLensRadius}
						hotspots={activeHotspots}
						bind:loaded={modelLoaded}
					/>
				{/key}
			{:else if activeDeckItem?.kind === 'image'}
				{#key activeDeckItem.url}
					<ImageOnlyScene imageUrls={[activeDeckItem.url]} />
				{/key}
			{/if}
		</Canvas>
	{:else}
		<div class="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-secondary">
			No 3D Content Available
		</div>
	{/if}

	<!-- Loading Bar -->
	{#if !modelLoaded && activeDeckItem?.kind === 'model'}
		<div class="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center gap-3">
			<div class="font-mono text-[10px] uppercase tracking-[0.25em] text-accent animate-pulse">Loading Model</div>
			<div class="w-48 h-px bg-border overflow-hidden">
				<div class="loading-bar-track h-full bg-accent"></div>
			</div>
		</div>
	{/if}

	<!-- Technical Overlay for 3D Viewer -->
	<div class="absolute top-4 left-4 font-mono text-[10px] text-secondary z-20 pointer-events-none uppercase tracking-widest bg-surface/80 p-1">
		3D.VIEWER // {project.name}
		{#if deckItems.length > 1}
			// {activeDeckItem?.kind === 'model' ? 'MDL' : 'IMG'} {activeItemIndex + 1} / {deckItems.length}
		{/if}
	</div>

	{#if deckItems.length > 1}
		<div class="absolute right-0 top-1/2 z-40 hidden -translate-y-1/2 md:block">
			<div
				class={`rotary-deck-shell ${deckHasEntered ? 'rotary-deck-shell-entered' : ''}`}
				onwheel={handleDeckWheel}
			>
				<!-- <div class="mb-2 font-mono text-[9px] text-secondary uppercase tracking-[0.2em]">{deckLabel}</div> -->
				<div class="rotary-deck-track">
					<div
						class="rotary-deck-wheel"
						style={`--wheel-rotation:${deckRotation}deg; --wheel-center-offset:${ROTARY_CENTER_OFFSET}px;`}
					>
						{#each rotaryDeck as deckCard}
							{@const isActiveCard = deckCard.itemIndex === activeItemIndex}
							{@const rotaryStyle = getRotaryCardStyle(deckCard.x, deckCard.y, deckCard.angle, isActiveCard)}
							<button
								type="button"
								data-item-index={deckCard.itemIndex}
								class={`rotary-deck-card text-left transition-all duration-300 ${
									isActiveCard
										? 'rotary-deck-card-active'
										: 'rotary-deck-card-passive'
								}`}
								style={rotaryStyle.style}
							onclick={() => setActiveItem(deckCard.itemIndex)}
							aria-label={`Switch to ${deckCard.label}`}
							>
								<span class="rotary-card-corner rotary-card-corner-tl"></span>
								<span class="rotary-card-corner rotary-card-corner-tr"></span>
								<span class="rotary-card-corner rotary-card-corner-bl"></span>
								<span class="rotary-card-corner rotary-card-corner-br"></span>
								<div class="rotary-card-frame">
									<div class="rotary-card-meta font-mono uppercase">
										<span class="rotary-card-index">{deckCard.typeLabel}</span>
										<span class={`rotary-card-state ${isActiveCard ? 'rotary-card-state-active' : ''}`}>
											{isActiveCard ? 'Selected' : 'Queued'}
										</span>
									</div>
									<div class="rotary-card-name">{deckCard.label}</div>
									<div class="rotary-card-footer font-mono uppercase">
										<span class="rotary-card-line"></span>
										<span class="rotary-card-channel">{deckCard.channelLabel}</span>
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
	
	<div class="absolute bottom-4 right-4 font-mono text-[10px] text-primary z-20 pointer-events-none uppercase tracking-widest bg-accent/10 px-2 py-1 border border-accent/20">
		<span class="inline-block w-2 h-2 bg-accent mr-1 animate-pulse"></span>
		{#if activeDeckItem?.kind === 'model'}
			Interactive (Drag & Hover)
		{:else}
			Interactive (Drag)
		{/if}
	</div>

	<!-- X-Ray Lens Cursor Indicator -->
	{#if containerEl && activeDeckItem?.kind === 'model'}
		<div 
			class="absolute rounded-full border border-accent/60 pointer-events-none z-30 mix-blend-screen"
			style="
				width: {xrayLensRadius * 2}px;
				height: {xrayLensRadius * 2}px;
				left: {cursorPos.x * 100}%;
				top: {cursorPos.y * 100}%;
				transform: translate(-50%, -50%);
				box-shadow: 0 0 15px rgba(253, 76, 46, 0.15), inset 0 0 30px rgba(253, 76, 46, 0.05);
			"
		>
			<div class="absolute top-1/2 left-0 w-full h-px bg-accent/20"></div>
			<div class="absolute left-1/2 top-0 h-full w-px bg-accent/20"></div>
		</div>
	{/if}
	
	<!-- UI Guidelines -->
	<div class="absolute top-0 bottom-0 left-[15%] z-20 border-l border-border/50 pointer-events-none border-dashed"></div>
	<div class="absolute top-0 bottom-0 right-[15%] z-20 border-r border-border/50 pointer-events-none border-dashed"></div>

	<!-- Crosshairs -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-20 opacity-20">
		<div class="absolute top-1/2 left-0 w-full h-[1px] bg-primary"></div>
		<div class="absolute left-1/2 top-0 h-full w-[1px] bg-primary"></div>
	</div>
</div>

<style>
	@keyframes loading-bar-sweep {
		0% { transform: translateX(-100%); }
		60% { transform: translateX(100%); }
		100% { transform: translateX(100%); }
	}

	.loading-bar-track {
		animation: loading-bar-sweep 1.4s ease-in-out infinite;
	}

	.rotary-deck-shell {
		opacity: 0;
		transform: translateX(26px);
		transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 320ms ease;
		pointer-events: auto;
	}

	.rotary-deck-shell-entered {
		opacity: 1;
		transform: translateX(0);
	}

	.rotary-deck-track {
		position: relative;
		width: 125px;
		height: 440px;
		overflow: hidden;
		perspective: 900px;
	}

	.rotary-deck-wheel {
		position: absolute;
		right: calc(0px - var(--wheel-center-offset, 0px));
		top: 50%;
		width: 0;
		height: 0;
		transform-origin: 0 0;
		transform: translateY(-50%) rotate(var(--wheel-rotation, 0deg));
		transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
		will-change: transform;
	}

	.rotary-deck-card {
		position: absolute;
		left: 0;
		top: 0;
		width: 124px;
		height: 86px;
		padding: 0;
		border: 1px solid rgba(229, 231, 235, 0.92);
		border-radius: 2px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 248, 250, 0.94));
		color: rgb(15, 23, 42);
		overflow: hidden;
		cursor: pointer;
		transform: translate3d(var(--deck-card-x, 0px), var(--deck-card-y, 0px), 0)
			translate(-50%, -50%)
			rotate(var(--deck-card-tilt, 0deg));
		opacity: 0.68;
		filter: saturate(0.8) grayscale(0.08);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.72);
		transition: opacity 220ms ease, filter 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease;
	}

	.rotary-deck-card::before {
		content: '';
		position: absolute;
		left: 10px;
		right: 10px;
		top: 0;
		height: 1px;
		background: linear-gradient(90deg, rgba(253, 76, 46, 0), rgba(253, 76, 46, 0.72), rgba(253, 76, 46, 0));
		opacity: 0.18;
		transition: opacity 220ms ease;
	}

	.rotary-card-frame {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		padding: 9px;
		border: 1px solid rgba(229, 231, 235, 0.9);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 44%),
			linear-gradient(135deg, rgba(253, 76, 46, 0.04), rgba(253, 76, 46, 0));
	}

	.rotary-card-meta,
	.rotary-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		font-size: 7px;
		letter-spacing: 0.16em;
	}

	.rotary-card-meta {
		color: rgba(100, 116, 139, 0.9);
	}

	.rotary-card-index {
		white-space: nowrap;
	}

	.rotary-card-state {
		padding: 2px 4px;
		border: 1px solid rgba(229, 231, 235, 0.95);
		background: rgba(255, 255, 255, 0.7);
		color: rgba(100, 116, 139, 0.92);
	}

	.rotary-card-state-active {
		border-color: rgba(253, 76, 46, 0.22);
		background: rgba(253, 76, 46, 0.12);
		color: rgba(253, 76, 46, 0.92);
	}

	.rotary-card-name {
		font-size: 11px;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: rgb(15, 23, 42);
		text-transform: uppercase;
	}

	.rotary-card-footer {
		color: rgba(100, 116, 139, 0.82);
	}

	.rotary-card-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(15, 23, 42, 0.22), rgba(15, 23, 42, 0));
	}

	.rotary-card-channel {
		white-space: nowrap;
	}

	.rotary-card-corner {
		position: absolute;
		width: 7px;
		height: 7px;
		pointer-events: none;
		opacity: 0.45;
		border-color: rgba(15, 23, 42, 0.22);
		transition: opacity 220ms ease, border-color 220ms ease;
	}

	.rotary-card-corner-tl {
		left: 0;
		top: 0;
		border-left: 1px solid;
		border-top: 1px solid;
	}

	.rotary-card-corner-tr {
		right: 0;
		top: 0;
		border-right: 1px solid;
		border-top: 1px solid;
	}

	.rotary-card-corner-bl {
		left: 0;
		bottom: 0;
		border-left: 1px solid;
		border-bottom: 1px solid;
	}

	.rotary-card-corner-br {
		right: 0;
		bottom: 0;
		border-right: 1px solid;
		border-bottom: 1px solid;
	}

	.rotary-deck-card-active {
		opacity: 1;
		filter: none;
		border-color: rgba(253, 76, 46, 0.32);
		background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 248, 245, 0.96));
		box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(253, 76, 46, 0.08);
	}

	.rotary-deck-card-active::before {
		opacity: 1;
	}

	.rotary-deck-card-active .rotary-card-frame {
		border-color: rgba(253, 76, 46, 0.24);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0) 44%),
			linear-gradient(135deg, rgba(253, 76, 46, 0.12), rgba(253, 76, 46, 0.01));
	}

	.rotary-deck-card-active .rotary-card-meta,
	.rotary-deck-card-active .rotary-card-footer {
		color: rgba(15, 23, 42, 0.72);
	}

	.rotary-deck-card-active .rotary-card-name {
		color: rgba(253, 76, 46, 0.95);
	}

	.rotary-deck-card-active .rotary-card-line {
		background: linear-gradient(90deg, rgba(253, 76, 46, 0.45), rgba(253, 76, 46, 0));
	}

	.rotary-deck-card-active .rotary-card-corner {
		opacity: 1;
		border-color: rgba(253, 76, 46, 0.56);
	}

	.rotary-deck-card-passive {
		box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.58);
	}
</style>

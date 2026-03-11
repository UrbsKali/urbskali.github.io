<script lang="ts">
	import { Canvas } from '@threlte/core';
	import ModelScene from './ModelScene.svelte';
	import type { Project } from '$lib/types';
	
	let { project }: { project: Project } = $props();
	
	let cursorPos = $state({ x: 0, y: 0 });
	let containerEl: HTMLDivElement | undefined = $state();
	let xrayLensRadius = $state(60);

	function handleMouseMove(e: MouseEvent) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		cursorPos = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};
	}
</script>

<div 
	class="w-full h-[300px] md:h-[500px] border border-border bg-surface relative overflow-hidden group mb-12"
	role="img"
	bind:this={containerEl}
	onmousemove={handleMouseMove}
>
	<Canvas>
		<ModelScene 
			url={project.model_3d!} 
			cursorPos={cursorPos}
			{xrayLensRadius}
			hotspots={project.hotspots || []} 
		/>
	</Canvas>

	<!-- Technical Overlay for 3D Viewer -->
	<div class="absolute top-4 left-4 font-mono text-[10px] text-secondary z-20 pointer-events-none uppercase tracking-widest bg-surface/80 p-1">
		3D.VIEWER // {project.name}
	</div>
	
	<div class="absolute bottom-4 right-4 font-mono text-[10px] text-primary z-20 pointer-events-none uppercase tracking-widest bg-accent/10 px-2 py-1 border border-accent/20">
		<span class="inline-block w-2 h-2 bg-accent mr-1 animate-pulse"></span>
		Interactive (Drag & Hover)
	</div>

	<!-- X-Ray Lens Cursor Indicator -->
	{#if containerEl}
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
	<div class="absolute top-0 bottom-0 left-[10%] z-20 border-l border-border/50 pointer-events-none border-dashed"></div>
	<div class="absolute top-0 bottom-0 right-[10%] z-20 border-r border-border/50 pointer-events-none border-dashed"></div>

	<!-- Crosshairs -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-20 opacity-20">
		<div class="absolute top-1/2 left-0 w-full h-[1px] bg-primary"></div>
		<div class="absolute left-1/2 top-0 h-full w-[1px] bg-primary"></div>
	</div>
</div>

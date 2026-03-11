<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	// This component serves as the wrapper for the ThreeJS canvas context.
</script>

<div class="w-full h-[400px] border border-border bg-surface relative overflow-hidden group">
	<!-- Technical Overlay for 3D Viewer -->
	<div class="absolute top-4 left-4 font-mono text-[10px] text-secondary z-10 pointer-events-none uppercase tracking-widest">
		Viewport.3D // Interactive Mode
	</div>
	<div class="absolute bottom-4 right-4 font-mono text-[10px] text-secondary z-10 pointer-events-none uppercase tracking-widest">
		Drag to Rotate
	</div>
	
	<!-- Crosshairs -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10 opacity-30">
		<div class="absolute top-1/2 left-0 w-full h-[1px] bg-primary"></div>
		<div class="absolute left-1/2 top-0 h-full w-[1px] bg-primary"></div>
	</div>

	<Canvas>
		<Scene />
	</Canvas>
</div>

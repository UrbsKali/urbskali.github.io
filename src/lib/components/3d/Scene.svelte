<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, Float } from '@threlte/extras';

	let rotation = 0;

	// Slowly rotate the geometric hub
	useTask((delta) => {
		rotation += delta * 0.2;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45}>
	<OrbitControls enableZoom={false} enablePan={false} />
</T.PerspectiveCamera>

<T.DirectionalLight position={[3, 10, 7]} intensity={1.5} />
<T.AmbientLight intensity={0.5} />

<!-- The "Hub" representing the 4 domains (Option 3 approach, minimalistic) -->
<Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
	<T.Group rotation.y={rotation} rotation.x={rotation * 0.5}>
		<!-- Core Wireframe Geometric Shape -->
		<T.Mesh>
			<T.IcosahedronGeometry args={[1.5, 0]} />
			<T.MeshStandardMaterial color="#0F172A" wireframe={true} wireframeLinewidth={2} />
		</T.Mesh>

		<!-- Glowing Inner Core -->
		<T.Mesh>
			<T.IcosahedronGeometry args={[1.2, 0]} />
			<T.MeshBasicMaterial color="#FD4C2E" transparent={true} opacity={0.1} />
		</T.Mesh>
	</T.Group>
</Float>
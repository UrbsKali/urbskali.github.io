import type { Project } from '../types';

export const projects: Project[] = [
	{
		id: 'PRJ-26-03',
		slug: 'e-spin',
		name: 'E-Spin: The dev board you will actually carry',
		date: new Date('2026-03-26'),
		year: 2026,
		domain: 'Electronics',
		description: 'A rust-based high-performance navigation routing daemon designed for speculative orbital mapping. Handles non-euclidean pathfinding with microsecond latency.',
		skills_used: ['KiCAD', 'Industrial Design', 'Crowdfunding', 'Rust'],
		images: [],
		model_3d: '/assets/models/Handspinner.glb',
		hotspots: [
			{
				position: [0, 0.5, 0],
				label: 'Ceramic Bearing Hub',
				description: 'High-speed frictionless hybrid ceramic bearing for minimal drag.'
			},
			{
				position: [1.2, -0.2, 0],
				label: 'Titanium Weights',
				description: 'Perimeter counterweights perfectly balanced for optimized centrifugal inertia.'
			}
		],
		links: [
			{ type: 'github', label: 'Repository', url: 'https://github.com/example/orbital-nav' }
		]
	},
	{
		id: 'PRJ-25-04',
		slug: 'haptic-glove-v2',
		name: 'Haptic Glove V2',
		date: new Date('2025-11-05'),
		year: 2025,
		domain: 'Electronics',
		description: 'Iterative design of a VR haptic feedback glove featuring custom flex sensors and a lightweight ESP32 controller. Reduces latency by 45% over previous iteration.',
		skills_used: ['C++', 'PCB Design', 'ESP32', 'I2C'],
		images: [],
		links: [
			{ type: 'github', label: 'Firmware', url: 'https://github.com/example/haptic' }
		]
	},
	{
		id: 'PRJ-25-02',
		slug: 'titanium-extruder-mount',
		name: 'Titanium Extruder Mount',
		date: new Date('2025-06-20'),
		year: 2025,
		domain: 'Mechanical',
		description: 'A topologically optimized, 3D printed titanium extruder mount for high-speed core-xy parameter. Reduces moving mass significantly while maintaining high rigidity.',
		skills_used: ['SolidWorks', 'ANSYS', 'Topology Optimization', 'DMLS'],
		images: [],
		links: [
			{ type: 'paper', label: 'Whitepaper', url: '#' }
		]
	},
	{
		id: 'PRJ-24-08',
		slug: 'agile-manufacturing-migration',
		name: 'Agile Manufacturing Migration',
		date: new Date('2024-08-10'),
		year: 2024,
		domain: 'Management',
		description: 'Spearheaded the migration of the prototyping lab to an agile kanban methodology, integrating automated material tracking using RFID tech.',
		skills_used: ['Jira', 'Kanban', 'RFID Integration', 'Process Engineering'],
		images: [],
		links: []
	}
];

import type { Project } from '../types';

export const projects: Project[] = [
	{
		id: 'PRJ-26-03',
		slug: 'e-spin',
		name: 'E-Spin',
		date: new Date('2026-03-26'),
		year: 2026,
		domain: 'Electronics',
		description: 'The dev board you will actually carry. A compact, high-performance microcontroller board designed for on-the-go prototyping & education',
		skills_used: ['KiCAD', 'Industrial Design', 'Crowdfunding'],
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
			{ type: 'github', label: 'Repository', url: 'https://github.com/UrbsKali/E-spin_board' },
			{ type: 'website', label: 'Website', url: 'https://espin.urbskali.fr' }
		]
	},
	{
		id: 'PRJ-25-04',
		slug: 'cdr',
		name: 'French Robotic cup',
		date: new Date('2025-05-15'),
		year: 2025,
		domain: 'Electronics',
		description: 'Designed and built a competitive robot for the Coupe de Robotique, a prestigious French robotics competition. Led a team of 12 students through the entire project lifecycle, from concept to competition.',
		skills_used: ['C++', 'PCB Design', 'Solidworks', 'Management'],
		images: [],
		links: [
			{ type: 'github', label: 'Repository', url: 'https://github.com/davincibot/CoupeDeRobotique' }
		]
	},
	{
		id: 'PRJ-25-02',
		slug: 'president-davincibot',
		name: 'President of DaVinciBot',
		date: new Date('2025-02-20'),
		year: 2025,
		domain: 'Management',
		description: 'Elected President of DaVinciBot, the robotics club of ESILV engineering school. Oversaw a team of 130+ members, organized workshops and events, and led the club to new heights in terms of project quality and member engagement.',
		skills_used: ['Leadership', 'Growth Strategy', 'Stategic planning', 'Management'],
		images: [],
		links: [
			{ type: 'paper', label: 'Whitepaper', url: '#' }
		]
	},
];

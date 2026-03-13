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
		models_3d: ['/assets/models/Handspinner.glb', '/assets/models/smartlock.glb'],
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
		id: 'PRJ-25-09',
		slug: 'smartlock',
		name: 'Smart Lock',
		date: new Date('2025-09-25'),
		year: 2025,
		domain: 'Electronics',
		description: 'A NFC and Bluetooth enabled smart lock designed to secure the locker of DaVinciBot, without the need for code, and working with the students card of our members. The lock is designed to be easily installable on any locker and provides a secure and convenient way for members to access their belongings.',
		skills_used: ['KiCAD', 'Analog Design', 'Firmware Development'],
		images: [],
		model_3d: '/assets/models/smartlock.glb',
		hotspots: [
			{
				position: [-0.4, 0, -0.55],
				label: 'STM NFC Chip',
				description: 'NFC controller for secure communication with student cards, enabling keyless access to lockers. Support Interupt to save battery life'
			},
			{
				position: [0.1, -0.1, -1.1],
				label: 'Matching circuit',
				description: 'Match the parameter of the antenna use to receive the RF signal'
			},
			{
				position: [-0.8, -0.1, 1.1],
				label: 'Power circuit',
				description: 'Reduce the 9v comming from the LiPo battery to 3.3v and 5v'
			},
			{
				position: [1.2, 0.1, 0],
				label: 'ESP32 C3 Mini',
				description: 'Low-power microcontroller with integrated Wi-Fi and Bluetooth connectivity, serving as the brain of the smart lock. '
			}
		],
		links: [
			{ type: 'website', label: 'Website', url: 'https://davincibot.fr' }
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
			{ type: 'github', label: 'Repository', url: 'https://github.com/davincibot/CoupeDeRobotique' },
			{ type: 'website', label: 'Website', url: 'https://davincibot.fr' }

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
		images: ['/assets/images/dvb.jpg'],
		links: [
			{ type: 'website', label: 'Website', url: 'https://davincibot.fr' }
		]
	},
];

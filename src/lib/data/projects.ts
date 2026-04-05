import type { Project } from '../types';

export const projects: Project[] = [
	{
		id: 'PRJ-26-03',
		slug: 'e-spin',
		name: 'E-Spin',
		date: new Date('2026-03-26'),
		year: 2026,
		domains: ['Electronics', 'Software'],
		description: 'The dev board you will actually carry. A compact, high-performance microcontroller board designed for on-the-go prototyping & education',
		skills_used: ['KiCAD', 'Industrial Design', 'Crowdfunding'],
		images: ['/assets/images/ESPIN/Hero.png', '/assets/images/ESPIN/Exploded_details_big.png'],
		models_3d: ['/assets/models/Handspinner.glb'],
		hotspots_per_model: [
			[
				{
					position: [-1.25, -0.5, 0],
					label: 'LiPo Battery',
					description: 'Rechargeable battery providing up to 8 hours of continuous use, with USB-C charging and built-in protection circuitry.'
				},
				{
					position: [1.5, -0.5, 0],
					label: 'ESP32 C3 mini',
					description: 'Low-power microcontroller with integrated Wi-Fi and Bluetooth connectivity, serving as the brain of the E-Spin board.'
				},
				{
					position: [0.8, -0.6, 0],
					label: 'IMU',
					description: 'High precison 6 axis Inertial Mersurment Unit, capable of Wake on Motion and include a podometer'
				},
				{
					position: [0.9, -0.45, 0.5],
					label: 'GPIOs',
					description: '12 General Purpose Input/Output pins for connecting sensors, actuators, and other peripherals, with support for I2C, SPI, ADC and PWM interfaces.'
				},
				{
					position: [-1.1, -0.7, 0],
					label: 'LED ribbon',
					description: 'Fully addressable RGB LED strip with 8 LEDs, allowing for customizable lighting effects and visual feedback for your projects.'
				}
			],
			[] // Smartlock model — hotspots defined in the dedicated smartlock project
		],
		links: [
			{ type: 'github', label: 'Repository', url: 'https://github.com/E-spin-fr' },
			{ type: 'website', label: 'E-Spin Website', url: 'https://docs.e-spin.fr' },
			{ type: 'website', label: 'Kickstarter Campaign', url: 'https://www.kickstarter.com/projects/322093471/e-spin?ref=1ty49a' }
		]
	},
	{
		id: 'PRJ-25-09',
		slug: 'smartlock',
		name: 'Smart Lock',
		date: new Date('2025-09-25'),
		year: 2025,
		domains: ['Electronics', 'Software'],
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
		domains: ['Electronics', 'Mechanical', 'Management'],
		description: 'Designed and built a competitive robot for the Coupe de Robotique, a prestigious French robotics competition. Led a team of 12 students through the entire project lifecycle, from concept to competition.',
		skills_used: ['C++', 'PCB Design', 'Solidworks', 'Management'],
		model_3d: '/assets/models/cdr2025.glb',
		images: ['/assets/images/CDR/cdr25.jpg', '/assets/images/CDR/cdr24.webp', '/assets/images/CDR/equipe25.jpg'],
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
		domains: ['Management'],
		description: 'Elected President of DaVinciBot, the robotics club of ESILV engineering school. Oversaw a team of 130+ members, organized workshops and events, and led the club to new heights in terms of project quality and member engagement.',
		skills_used: ['Leadership', 'Growth Strategy', 'Stategic planning', 'Conflit Resolution'],
		images: ['/assets/images/Pres/dvb.jpg'],
		links: [
			{ type: 'website', label: 'Website', url: 'https://davincibot.fr' },
			{ type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/company/davincibot' }

		]
	},
	{
		id: 'PRJ-24-02',
		slug: 'treso-davincibot',
		name: 'Treasurer of DaVinciBot',
		date: new Date('2024-02-20'),
		year: 2024,
		domains: ['Management'],
		description: 'Served as Treasurer of DaVinciBot, the robotics club of ESILV engineering school. Managed the club\'s finances, made budget forecasts, added compliance measures, and ensured transparent financial reporting.',
		skills_used: ['Accounting', 'Excel', 'Financial Planning'],
		images: ['/assets/images/Pres/dvb.jpg'],
		links: [
			{ type: 'website', label: 'Website', url: 'https://davincibot.fr' },
			{ type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/company/davincibot' }

		]
	},
	{
		id: 'PRJ-25-11',
		slug: 'drone-defense-hackathon',
		name: 'Drone Defense Hackathon',
		date: new Date('2025-11-10'),
		year: 2025,
		domains: ['Software', 'Electronics'],
		description: `Participated in the Drone Defense Hackathon, a major European defense innovation event held at the Grand Palais in Paris, bringing together 200+ engineering students (selected from thousands) to design and prototype drone-based solutions for real-world military use cases.

As President of DaVinciBot, I led the initiative end-to-end:

- Recruited and structured a multidisciplinary team of engineers
- Managed the application process and secured our team's selection among highly competitive candidates
- Defined the technical direction and coordinated execution during the hackathon

Over an intensive 48 hour cycle, we developed a functional prototype addressing drone communication and operational constraints in contested environments.

A key contribution was the design and implementation of a real-time video transmission system using low-frequency RF, enabling more robust communication in environments where conventional links are unreliable. This component was engineered with reusability in mind and is now a foundation for future DaVinciBot projects.

Beyond the technical deliverable, the experience involved:

- Rapid prototyping and testing in a 1,000 m² live drone arena
- Iterating under real-world constraints inspired by defense scenarios
- Engaging with mentors, defense experts, and AI specialists to validate and challenge our approach

Although the project did not reach the final stage, the technical feedback confirmed the relevance and scalability of our solution, particularly regarding resilient communication systems for drones.

This experience strengthened my ability to:

- Lead high-performing teams under pressure
- Translate complex constraints into actionable engineering solutions
- Build systems with both practical deployment considerations and long-term reuse in mind
		`,
		skills_used: ['LoRa', 'GNSS', 'Embedded Systems'],
		images: ['/assets/images/DDH/ddh.jpg', '/assets/images/DDH/ddh1.jpg', '/assets/images/DDH/ddh2.jpg', '/assets/images/DDH/grandpalais.webp'],
		links: [
			{ type: 'website', label: 'Blog post', url: 'https://davincibot.fr/blog/davincibot-selectionne-pour-le-drone-defense-hackathon/' },
			{ type: 'website', label: 'Registration', url: 'https://www.agorize.com/en/challenges/drone-defense-hackathon' },
			{ type: 'website', label: 'French Military blog post', url: 'https://www.defense.gouv.fr/terre/actualites/drone-defense-hackathon-collaboration-entre-larmee-jeunesse-ingenieure' }
		]
	},
];

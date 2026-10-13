export type TimelineCategory = 'Employment' | 'Leadership' | 'Education' | 'Volunteering';
export type TimelineStatus = 'ended' | 'present' | 'expected';

export interface TimelineEntry {
	title: string;
	organization: string;
	category: TimelineCategory;
	start: string;
	end: string | null;
	status: TimelineStatus;
	location?: string;
	description: string;
	highlights?: string[];
}

export const timelineEntries: TimelineEntry[] = [
	{
		title: 'General Baccalaureate',
		organization: 'Lycée Saint Erembert',
		category: 'Education',
		start: '2019-09',
		end: '2021-06',
		status: 'ended',
		description: 'Completed the French general baccalaureate.'
	},
	{
		title: 'Engineering degree',
		organization: 'ESILV - Ecole Supérieure d’Ingénieurs Léonard de Vinci',
		category: 'Education',
		start: '2022-09',
		end: '2027-06',
		status: 'expected',
		description: 'Engineering studies at ESILV, with graduation expected in 2027.',
		highlights: ['C#', 'Physics']
	},
	{
		title: 'Freelance Full-Stack Developer',
		organization: 'Oblivion',
		category: 'Employment',
		start: '2022-06',
		end: '2025-08',
		status: 'ended',
		location: 'Remote',
		description:
			'Built an automated registration system, designed and developed a website, and created a live League of Legends casting tool. Aggregated match statistics through the Riot API to generate personalized analysis for participants.'
	},
	{
		title: 'Member',
		organization: 'DaVinciBot',
		category: 'Volunteering',
		start: '2023-01',
		end: '2023-09',
		status: 'ended',
		description: 'Joined the robotics association at Pôle universitaire Léonard de Vinci.'
	},
	{
		title: 'Member',
		organization: 'LéoFly',
		category: 'Volunteering',
		start: '2022-09',
		end: '2023-08',
		status: 'ended',
		description:
			'Contributed to an aerospace association that designs and builds rockets for European competitions including EuRoC and C’Space.'
	},
	{
		title: 'Trainer',
		organization: 'DeVinci FabLab',
		category: 'Employment',
		start: '2023-06',
		end: null,
		status: 'present',
		description:
			'Teach students of all levels to use technologies including Rust, Git, Docker, Kubernetes, and Godot.'
	},
	{
		title: 'Project Manager',
		organization: 'DaVinciBot',
		category: 'Leadership',
		start: '2023-09',
		end: '2024-09',
		status: 'ended',
		description: 'Managed a 12-person team for the Coupe de Robotique.',
		highlights: ['Team leadership', 'Robotics competition']
	},
	{
		title: 'Module Coordinator',
		organization: 'EMLV - Ecole de Management Léonard de Vinci',
		category: 'Employment',
		start: '2023-09',
		end: '2025-07',
		status: 'ended',
		location: 'La Défense, France',
		description:
			'Created course materials, coordinated instructors, and taught 520 second-year students to deliver practical projects.',
		highlights: ['Course design', 'Instructor coordination', '520 students']
	},
	{
		title: 'Study Abroad - Electrical and Electronics Engineering',
		organization: 'University of Sunderland',
		category: 'Education',
		start: '2024-09',
		end: '2025-01',
		status: 'ended',
		description: 'Study abroad period in Electrical and Electronics Engineering.'
	},
	{
		title: 'Intern',
		organization: 'Brain Shell',
		category: 'Employment',
		start: '2024-06',
		end: '2024-08',
		status: 'ended',
		location: 'La Défense, France',
		description:
			'Built a connected rugby helmet designed to detect concussions, including miniature PCB fabrication, embedded C/C++ and Rust development, and BLE transmission of medical data.',
		highlights: ['Embedded systems', 'PCB design', 'BLE']
	},
	{
		title: 'Consultant',
		organization: 'DeVinci Junior',
		category: 'Employment',
		start: '2024-04',
		end: '2025-07',
		status: 'ended',
		description:
			'Completed client assignments, most often involving software engineering.'
	},
	{
		title: 'Treasurer',
		organization: 'DaVinciBot',
		category: 'Leadership',
		start: '2024-03',
		end: '2025-02',
		status: 'ended',
		description:
			'Managed the robotics club’s finances, prepared budget forecasts, introduced compliance measures, and maintained transparent financial reporting.',
		highlights: ['Financial planning', 'Risk management', 'Reporting']
	},
	{
		title: 'President',
		organization: 'DaVinciBot',
		category: 'Leadership',
		start: '2025-02',
		end: '2026-03',
		status: 'ended',
		location: 'Paris, France',
		description:
			'Led the robotics association at ESILV, overseeing 130+ members, organizing workshops and events, and supporting the quality and engagement of club projects.',
		highlights: ['130+ members', 'Team leadership', 'Project management']
	},
	{
		title: 'Full-Stack Robotics & Systems Intern',
		organization: 'BELLATOR-OSS',
		category: 'Employment',
		start: '2026-04',
		end: '2026-08',
		status: 'ended',
		location: 'Faro, Portugal',
		description: 'Five-month, on-site internship focused on full-stack robotics and systems.'
	},
	{
		title: 'Project Roadmap Manager',
		organization: 'DaVinciBot',
		category: 'Leadership',
		start: '2026-09',
		end: null,
		status: 'present',
		location: 'La Défense, France',
		description: 'Managing the project roadmap for the DaVinciBot robotics association.'
	}
];
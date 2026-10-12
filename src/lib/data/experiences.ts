export type ExperienceIcon =
	| 'leadership'
	| 'education'
	| 'engineering'
	| 'crown'
	| 'book'
	| 'robot';

export interface Experience {
	slug: string;
	role: string;
	category: string;
	icon: ExperienceIcon;
}

export const experiences: Experience[] = [
	{
		slug: 'president-davincibot',
		role: 'President of DaVinciBot',
		category: 'Leadership',
		icon: 'crown'
	},
	{
		slug: 'respo-module-emlv',
		role: 'Module Coordinator at EMLV',
		category: 'Education',
		icon: 'education'
	},
	{
		slug: 'e-spin',
		role: 'Creative Technologist',
		category: 'Product Engineering',
		icon: 'engineering'
	}
];
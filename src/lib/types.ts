// global type definitions for the project
export type ProjectDomain = 'Software' | 'Electronics' | 'Mechanical' | 'Management' | 'Other';

export interface ProjectLink {
	type: 'github' | 'linkedin' | 'website' | 'paper' | 'other';
	url: string;
	label: string;
}

export interface ProjectHotspot {
	position: [number, number, number];
	label: string;
	description: string;
}

export interface Project {
	id: string;               // e.g., 'PRJ-24-01'
	slug: string;             // URL friendly identifier
	name: string;
	start_date: Date;
	end_date?: Date | null;
	experience_slugs?: string[];
	domains: ProjectDomain[];
	description: string;      // Markdown or HTML string
	skills_used: string[];    // Array of technical tags
	og_img?: string;          // URL to the project's Open Graph and preview image
	model_3d?: string;        // Optional URL to .glb/.gltf file
	models_3d?: string[];     // Optional list of URLs for multi-model projects
	hotspots?: ProjectHotspot[]; // Optional 3D spatial annotations (single model fallback)
	hotspots_per_model?: ProjectHotspot[][]; // hotspots_per_model[i] = hotspots for models_3d[i]
	links: ProjectLink[];
}

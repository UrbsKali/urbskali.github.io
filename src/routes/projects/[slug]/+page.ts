import { projects } from '$lib/data/projects';
import { error } from '@sveltejs/kit';

export const entries = () => {
    return projects.map((project) => ({ slug: project.slug }));
};

export const load = ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    
    if (!project) {
        throw error(404, 'Project not found');
    }
    
    return {
        project
    };
};

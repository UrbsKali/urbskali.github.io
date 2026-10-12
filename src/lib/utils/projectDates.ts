import type { Project } from '$lib/types';

type ProjectTimeline = Pick<Project, 'start_date' | 'end_date'>;

export function formatProjectDate(date: Date) {
	return new Intl.DateTimeFormat('en', {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(date);
}

export function formatProjectDateRange(project: ProjectTimeline) {
	const start = formatProjectDate(project.start_date);
	if (project.end_date === undefined) return start;

	const end = project.end_date === null ? 'Present' : formatProjectDate(project.end_date);
	return `${start} - ${end}`;
}

export function formatProjectDuration(start: Date, end: Date) {
	let years = end.getUTCFullYear() - start.getUTCFullYear();
	let months = end.getUTCMonth() - start.getUTCMonth();
	let days = end.getUTCDate() - start.getUTCDate();

	if (days < 0) {
		months -= 1;
		days += new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
	}
	if (months < 0) {
		years -= 1;
		months += 12;
	}

	const parts = [
		years ? `${years} ${years === 1 ? 'year' : 'years'}` : '',
		months ? `${months} ${months === 1 ? 'month' : 'months'}` : '',
		days ? `${days} ${days === 1 ? 'day' : 'days'}` : ''
	].filter(Boolean);

	return parts.join(', ') || 'Less than a day';
}
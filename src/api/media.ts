// Return the absolute path to an image resource
export function getImagePath(type: string, filename: string) {
	return `${process.cwd()}/media/img/${type}/${filename}`;
}

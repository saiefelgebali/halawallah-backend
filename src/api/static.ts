export function getImagePath(type: "pfp" | "post", filename: string) {
	// Return the absolute path to an image resource
	return `${process.cwd()}/media/img/${type}/${filename}`;
}

export function sluggify(str: string | undefined) {
	return str?.trim().toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/, " ").split(" ").join("-");
};

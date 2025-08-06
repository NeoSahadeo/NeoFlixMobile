const TMDB_PICTURE_ORIGINAL = "https://image.tmdb.org/t/p/original/";
const TMDB_PICTURE_SMALL = "https://image.tmdb.org/t/p/w500/";

async function fetchPicture(url: string, type: "small" | "original") {
	try {
		const response = await fetch(
			type === "original"
				? TMDB_PICTURE_ORIGINAL + url
				: TMDB_PICTURE_SMALL + url,
		);
		if (response.ok) {
			return await response.blob();
		}
	} catch (err) {
		console.error(err);
	}
}

function resolveImage(url: string, type: "small" | "original") {
	return type === "original"
		? TMDB_PICTURE_ORIGINAL + url
		: TMDB_PICTURE_SMALL + url;
}

export { fetchPicture, resolveImage };

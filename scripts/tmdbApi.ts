import axios from "axios";

const TMDB_API = "https://api.themoviedb.org/3/";

export async function fetchTrending(
	apiKey: string,
	selector: "all" | "movie" | "tv",
	timeWindow: "day" | "week",
	page: number = 1,
) {
	try {
		const response = await axios.get(
			TMDB_API + "trending/" + selector + "/" + timeWindow + `?page=${page}`,
			{
				method: "GET",
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);
		if (response.status === 200) {
			return await response.data;
		}
	} catch (err) {
		console.log(err);
	}
	return null;
}
export async function search(
	apiKey: string,
	query: string,
	page: number = 1,
): Promise<{ tv: JSON; movie: JSON } | null> {
	try {
		const tv_response = await fetch(
			TMDB_API + "search/tv?query=" + query + "&page=" + page,
			{
				method: "GET",
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);
		const movie_response = await fetch(
			TMDB_API + "search/movie?query=" + query + "&page=" + page,
			{
				method: "GET",
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
			},
		);
		if (tv_response.ok && movie_response.ok) {
			const tv_json = await tv_response.json();
			const movie_json = await movie_response.json();
			return {
				tv: tv_json,
				movie: movie_json,
			};
		}
	} catch (err) {
		console.log(err);
		return null;
	}
}

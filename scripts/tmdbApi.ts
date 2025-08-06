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

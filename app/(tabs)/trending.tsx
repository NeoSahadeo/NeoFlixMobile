import { SafeAreaView } from "react-native-safe-area-context"
import { FlatList, Pressable, useWindowDimensions } from "react-native"
import { useEffect, useState } from "react";

import Colors from "@/styles/Colors"
import { fetchTrending } from "@/scripts/tmdbApi"
import { useSession } from "@/contexts/AuthContext"
import DefaultPoster from "@/components/posters/DefaultPoster";
import PageTitle from "@/components/headings/PageTitle";

export default function HomePage() {
	const { apiKey } = useSession();
	const [posters, setPosters] = useState([]);
	const [trendingType, setTrendingType] = useState<"tv" | "movie" | "all">("all")
	const [timeWindow, setTimeWindow] = useState<"day" | "week">("day")
	// const [page, page] = useState<"tv"|"movie">("tv")


	useEffect(() => {
		(async () => {
			const r = await fetchTrending(apiKey, trendingType, timeWindow)
			if (r)
				setPosters(r.results)
		})();
	}, [])

	const { width } = useWindowDimensions();
	const [numColumns, setNumColumns] = useState(2);
	const [colSize, setColSize] = useState(0);

	useEffect(() => {
		if (width < 250) setNumColumns(1);
		else if (width < 600) setNumColumns(2);
		else setNumColumns(3);

		setColSize(Math.floor(width / numColumns))
	}, [width]);
	return (
		<SafeAreaView style={{
			backgroundColor: Colors.backgroundPrimary
		}}
			className="flex-1 items-center"
		>
			<FlatList
				data={posters}
				key={`flatlist-${numColumns}`} // key forces full re-render on numColumns change
				keyExtractor={(e: any) => e.poster_path}
				renderItem={({ item }) => {
					// console.log(item)
					return (
						<Pressable onPress={() => {
							console.log(item.id)
						}}>
							<DefaultPoster colSize={colSize} src={item.poster_path} />
						</Pressable>
					)
				}}
				numColumns={numColumns}
			/>
		</SafeAreaView>
	)
}

import { SafeAreaView } from "react-native-safe-area-context"
import { FlatList, Pressable, useWindowDimensions, View } from "react-native"
import { useEffect, useState, useMemo } from "react";
import Colors from "@/styles/Colors"
import { fetchTrending } from "@/scripts/tmdbApi"
import { useSession } from "@/contexts/AuthContext"
import DefaultPoster from "@/components/posters/DefaultPoster";
import DropdownTimeWindow from "@/components/buttons/DropdownTimeWindow";
import DropdownTrending from "@/components/buttons/DropdownTrending";
import { router } from "expo-router";


export default function HomePage() {
	const { apiKey } = useSession();
	const [posters, setPosters] = useState([]);
	const [trendingType, setTrendingType] = useState<"tv" | "movie" | "all">("all")
	const [timeWindow, setTimeWindow] = useState<"day" | "week">("day")
	// const [page, page] = useState<"tv"|"movie">("tv")
	//


	useMemo(() => {
		(async () => {
			const r = await fetchTrending(apiKey, trendingType, timeWindow)
			if (r)
				setPosters(r.results)
		})();
	}, [timeWindow, trendingType])

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
			<View className="flex flex-row gap-3 my-3 ml-auto pr-4">
				<DropdownTimeWindow value={timeWindow} setValue={setTimeWindow} />
				<DropdownTrending value={trendingType} setValue={setTrendingType} />
			</View>
			<FlatList
				data={posters}
				key={`flatlist-${numColumns}`} // key forces full re-render on numColumns change
				keyExtractor={(e: any) => e.poster_path}
				renderItem={({ item }) => {
					// console.log(item)
					return (
						<Pressable onPress={() => {
							router.navigate(`/viewer/${item.media_type}/${item.id}`)
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

import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { RadarrApi, SonarrApi } from "radson";
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from "expo-image"
import Colors from '@/styles/Colors';
import { useSession } from '@/contexts/AuthContext';
import axios from 'axios';
import { resolveImage } from '@/scripts/urlUtils';
import { TrashcanIcon } from '@/components/icons/Trashcan';
import { PlusIcon } from '@/components/icons/Plus';


const sonarrAddress = async () => await AsyncStorage.getItem("sonarrAddress") ?? ""
const sonarrApiKey = async () => await SecureStore.getItemAsync("sonarrApiKey") ?? ""


const radarrAddress = async () => await AsyncStorage.getItem("radarrAddress") ?? ""
const radarrApiKey = async () => await SecureStore.getItemAsync("radarrApiKey") ?? ""

let sonarrApi: SonarrApi = null;
let radarrApi: RadarrApi = null;

export default function ViewerScreen() {
	const { type, id } = useLocalSearchParams();
	const [itemData, setItemData] = useState<any>(null)
	const [localData, setLocalData] = useState<any>(null)
	const [seasonalPosters, setSeasonalPosters] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const { width } = useWindowDimensions()
	const mainSize = width * 0.8;
	const miniSize = width * 0.4;
	const { apiKey } = useSession();

	const [numColumns, setNumColumns] = useState(2);
	const [colSize, setColSize] = useState(0);

	useEffect(() => {
		if (width < 250) setNumColumns(1);
		else if (width < 600) setNumColumns(2);
		else setNumColumns(3);

		setColSize(Math.floor(width / numColumns))
	}, [width]);

	useEffect(() => {
		(async () => {
			try {
				if (type === "tv") {
					const response = await axios.get("https://api.themoviedb.org/3/tv/" + id, {
						headers: {
							Authorization: `Bearer ${apiKey}`
						}
					})

					sonarrApi = new SonarrApi({
						sonarr_addr: await sonarrAddress(),
						sonarr_api_key: await sonarrApiKey()
					});

					if (response.status == 200) {
						setItemData(response.data)
					}

					const r = await sonarrApi.series.lookup("tmdb:" + id) as any

					if (r) {
						setLocalData(r.data[0])
					}
					setLoading(false)
				} else if (type === "movie") {
					const response = await axios.get("https://api.themoviedb.org/3/movie/" + id, {
						headers: {
							Authorization: `Bearer ${apiKey}`
						}
					})

					radarrApi = new RadarrApi({
						radarr_addr: await radarrAddress(),
						radarr_api_key: await radarrApiKey()
					});

					if (response.status == 200) {
						setItemData(response.data)
					}

					const r = await radarrApi.movie.lookup.tmdb(id) as any
					if (r) {
						setLocalData(r.data)
					}
					setLoading(false)
				}

			} catch (err) {
				console.error(err)
			}
		})();
	}, [])

	useEffect(() => {
		if (!itemData && !localData) return
		setSeasonalPosters(itemData.seasons)
	}, [itemData])

	if (loading) {
		// Optionally show a loader while fetching data
		return (
			<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	if (!itemData || !localData) {
		// Show fallback UI if no data found or error occured
		return (
			<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>No data available.</Text>
			</SafeAreaView>
		);
	}

	if (type == "tv") {
		return (
			<SafeAreaView className='flex-1 px-3' style={{
				backgroundColor: Colors.backgroundPrimary
			}}>
				<ScrollView>
					<View className='flex gap-2 items-center mb-10'>
						<Text className='text-3xl text-white font-bold'>
							{localData.title}
						</Text>
						<Image
							source={resolveImage(itemData.poster_path, "small")}
							contentFit="cover"
							style={{ width: mainSize * 0.9, height: mainSize * 1.6, margin: 3, borderRadius: 7 }}
						/>
						<View className='flex-1 flex flex-row justify-around gap-10'>
							<Text className='text-gray-400 text-lg font-black'>
								{localData.year}
							</Text>
							<Text className='text-gray-400 text-lg font-black'>
								{localData.statistics.seasonCount} {localData.statistics.seasonCount > 1 ? 'Seasons' : 'Season'}
							</Text>
						</View>
						<Text className='font-bold text-white self-start mt-3'>
							Description:
						</Text>
						<Text className='text-white text-lg'>
							{localData.overview}
						</Text>
						<View className='flex-1 items-start w-full mt-5'>
							<FlatList
								data={seasonalPosters}
								key={`flatlist-${numColumns}`} // key forces full re-render on numColumns change
								keyExtractor={(e: any) => e.poster_path}
								renderItem={({ item, index }) => {
									return (
										<View className='relative'>
											<Image
												source={resolveImage(item.poster_path, "small")}
												contentFit="cover"
												style={{ width: miniSize * 0.9, height: miniSize * 1.6, margin: 3, borderRadius: 7 }}
											/>
											<Text className='text-white text-wrap max-w-32'>
												{item.name}
											</Text>
											{localData.seasons[index]?.monitored && localData.id !== undefined ? (
												<Pressable onPress={async () => {
													try {
														localData.seasons[index].monitored = false
														const r = await axios({
															url: sonarrApi.sonarr_addr + "api/v3/series/" + localData.id,
															data: localData,
															method: "PUT",
															headers: {
																'Content-Type': 'application/json',
																accept: 'application/json',
																"X-Api-Key": sonarrApi.sonarr_api_key
															}
														})
														const x = await sonarrApi.series.lookup("tmdb:" + id) as any
														if (x) {
															setLocalData(x.data[0])
														}
													} catch (err) {
														console.error(err)
													}
												}} className='absolute bg-red-600 px-3 py-3 flex items-center right-0 mr-3 rounded-full mb-3 bottom-0'>
													<TrashcanIcon size={24} color={"white"} />
												</Pressable>
											) : (
												<Pressable onPress={async () => {
													try {
														if (localData.id) {
															localData.seasons[index].monitored = true
															const r = await axios({
																url: (sonarrApi.sonarr_addr + "api/v3/series/" + localData.id),
																data: localData,
																method: "PUT",
																headers: {
																	'Content-Type': 'application/json',
																	accept: 'application/json',
																	"X-Api-Key": sonarrApi.sonarr_api_key
																}
															})
														} else {
															const rootFolderPath = await axios.get(sonarrApi.sonarr_addr + "api/v3/rootfolder", {
																method: "GET",
																headers: {
																	'Content-Type': 'application/json',
																	accept: 'application/json',
																	"X-Api-Key": sonarrApi.sonarr_api_key
																}
															})
															localData.rootFolderPath = rootFolderPath.data[0].path
															localData.addOptions = {
																searchForMissingEpisodes: true,
																searchForCutoffUnmetEpisodes: true
															}
															localData.qualityProfileId = 1
															for (let x = 0; x < localData['seasons'].length; x++) {
																localData['seasons'][x]['monitored'] = false;
															}
															localData.seasons[index].monitored = true
															await axios({
																url: (sonarrApi.sonarr_addr + "api/v3/series"),
																data: localData,
																method: "POST",
																headers: {
																	'Content-Type': 'application/json',
																	accept: 'application/json',
																	"X-Api-Key": sonarrApi.sonarr_api_key
																}
															})
														}
														const x = await sonarrApi.series.lookup("tmdb:" + id) as any
														if (x) {
															setLocalData(x.data[0])
														}
													} catch (err) {
														console.error(err)
													}
												}} className='absolute bg-green-600 px-3 py-3 flex items-center right-0 mr-3 rounded-full mb-3 bottom-0'>
													<PlusIcon size={24} color="white" />
												</Pressable>
											)}
										</View>
									)
								}}
								numColumns={numColumns}
							/>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		)
	}
	if (type == "movie") {
		return (
			<SafeAreaView className='flex-1 px-3' style={{
				backgroundColor: Colors.backgroundPrimary
			}}>
				<ScrollView>
					<View className='flex gap-2 items-center mb-10'>
						<Text className='text-3xl text-white font-bold'>
							{localData.originalTitle}
						</Text>
						<Image
							source={resolveImage(itemData.poster_path, "small")}
							contentFit="cover"
							style={{ width: mainSize * 0.9, height: mainSize * 1.6, margin: 3, borderRadius: 7 }}
						/>
						<View className='flex-1 flex flex-row justify-around gap-10'>
							<Text className='text-gray-400 text-lg font-black'>
								{localData.year}
							</Text>
						</View>
						<Text className='font-bold text-white self-start mt-3'>
							Description:
						</Text>
						<Text className='text-white text-lg'>
							{localData.overview}
						</Text>
					</View>
					<View>
						{!localData.monitored ? (
							<Pressable
								onPress={() => {
								}}
							>
								<Text className='text-white bg-green-500 px-3 py-2 rounded w-32'>
									Add
								</Text>
							</Pressable>
						) : (
							<Pressable>
								<Text className='text-white bg-red-500 px-3 py-2 rounded w-32'>
									Remove
								</Text>
							</Pressable>
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
		)
	}
}

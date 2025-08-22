import { useSession } from '@/contexts/RadsonContext'
import Colors from '@/styles/Colors'
import { useCallback, useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { View, Text, ScrollView, FlatList, Pressable } from 'react-native'
import { Radson } from 'radson'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import SwipableListItem from '@/components/inputs/SwipableListItem'
import { Downloads } from '@/components/icons/Downloads'
import { TrashcanIcon } from '@/components/icons/Trashcan'

export default function() {
	const { radson }: { radson: Radson } = useSession()

	const [movieRecords, setMovieRecords] = useState<any>([])
	const [seriesRecords, setSeriesRecords] = useState<any>([])
	const [seriesDataSet, setSeriesDataSet] = useState<any>({})

	useFocusEffect(
		useCallback(() => {
			; (async () => {
				const r_1 = await radson.get_missing_movies()
				const r_2 = await radson.get_missing_series({ page_size: 1000 })

				if (r_1.data) {
					setMovieRecords(r_1.data['records'])
				}
				if (r_2.data) {
					setSeriesRecords(r_2.data['records'])
				}
			})()

			return () => {
				// Cleanup logic runs when navigating away (unloading)
			}
		}, [])
	)

	useEffect(() => { }, [movieRecords])

	useEffect(() => {
		const fetchSeriesMeta: any[] = []
		if (seriesRecords.length > 0) {
			seriesRecords.forEach((e: any) => {
				if (!fetchSeriesMeta.includes(e['seriesId'])) {
					fetchSeriesMeta.push(e['seriesId'])
				}
			})
		}

		; (async () => {
			const obj: any = {}
			for (let x = 0; x < fetchSeriesMeta.length; x++) {
				const r = await radson.fetch_local_data(
					'series',
					'local',
					fetchSeriesMeta[x]
				)
				obj[fetchSeriesMeta[x]] = r.data
			}
			setSeriesDataSet(obj)
		})()
	}, [seriesRecords])

	// useEffect(() => {
	// 	console.log(Object.keys(seriesDataSet))
	// }, [seriesDataSet])

	return (
		<SafeAreaView
			style={{
				backgroundColor: Colors.backgroundPrimary,
				flex: 1,
			}}
			className="px-2"
		>
			<GestureHandlerRootView>
				<ScrollView>
					{movieRecords?.length > 0 && (
						<>
							<Text className="text-white text-3xl font-bold mb-3">
								Requested Movies
							</Text>
							<FlatList
								data={movieRecords}
								key={`movieRecords-${Math.random()}`}
								keyExtractor={(e) => e['tmdbId']}
								renderItem={({ item }) => {
									console.log(item)
									return (
										<View>
											<View className="bg-gray-800 flex flex-row px-2 py-4 rounded-lg my-1">
												<Text className="text-white">
													{item['title']}
												</Text>
											</View>
										</View>
									)
								}}
							/>
						</>
					)}
					{seriesRecords?.length > 0 && (
						<>
							<Text className="text-white text-3xl font-bold my-3">
								Requested Series
							</Text>
							<FlatList
								data={Object.values(seriesDataSet)}
								key={`seriesRecords-${Math.random()}`}
								keyExtractor={(e: any) => e['tmdbId']}
								renderItem={({ item }: any) => {
									const size = 50
									const imageSrc = item['images']
										.filter((e) =>
											Object.keys(e).includes('coverType')
										)
										.filter(
											(e) => e['coverType'] === 'poster'
										)[0]['remoteUrl']
									return (
										<>
											<Pressable
												onLongPress={() => {
													console.log(
														'starting interactive search'
													)
												}}
												onPress={() => {
													router.navigate(
														`/viewer/tv/${item['tmdbId']}`
													)
												}}
											>
												<SwipableListItem
													leftCallback={() => {
														console.log(
															'deleting item'
														)
													}}
													rightCallback={() => {
														console.log(
															'starting download item'
														)
													}}
													leftView={
														<View className="bg-red-500 w-32 h-full rounded-lg absolute top-0 left-0  flex items-start justify-center pl-4">
															<TrashcanIcon
																size={32}
																color="white"
															/>
														</View>
													}
													rightView={
														<View className="bg-green-500 w-32 h-full rounded-lg absolute top-0 right-0 flex items-end justify-center pr-4">
															<Downloads
																size={32}
																color="white"
															/>
														</View>
													}
												>
													<Image
														source={imageSrc}
														contentFit="cover"
														style={{
															width: size,
															height: size,
															borderRadius: 4,
														}}
													/>
													<Text className="text-white text-lg">
														{item['title']}
													</Text>
												</SwipableListItem>
											</Pressable>
										</>
									)
								}}
							/>
						</>
					)}
				</ScrollView>
			</GestureHandlerRootView>
		</SafeAreaView>
	)
}

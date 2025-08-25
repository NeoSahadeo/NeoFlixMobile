import { useSession } from '@/contexts/RadsonContext'
import { Route, useLocalSearchParams } from 'expo-router'
import { Radson } from 'radson'
import React, { useEffect, useState, useMemo } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '@/styles/Colors'
import { Image } from 'expo-image'
import {
	Text,
	useWindowDimensions,
	View,
	Modal,
	Pressable as ReactPressable,
	FlatList,
} from 'react-native'
import {
	GestureHandlerRootView,
	Pressable,
	ScrollView,
} from 'react-native-gesture-handler'
import SwipableListItem from '@/components/inputs/SwipableListItem'
import { TrashcanIcon } from '@/components/icons/Trashcan'
import { SearchIcon } from '@/components/icons/Search'
import { Bookmark } from '@/components/icons/Bookmark'

type SearchParams = {
	id: number
	type: 'missing' | 'all' | number // type of number is the season number
}

export default function() {
	const { id, type } = useLocalSearchParams() as any as SearchParams
	const { width } = useWindowDimensions()

	const { radson }: { radson: Radson } = useSession()

	const [interactiveData, setInteractiveData] = useState<any>([])
	const [localData, setLocalData] = useState(null)
	const [records, setRecords] = useState<any[]>([])
	const [imgSrc, setImgSrc] = useState(null)
	const [modalVisible, setModalVisible] = useState(false)

	const getData = async () => {
		try {
			const r = await radson.fetch_local_data('series', 'local', id)
			setLocalData(r.data)
			setImgSrc(
				r.data['images']
					.filter((e) => Object.keys(e).includes('coverType'))
					.filter((e) => e['coverType'] === 'poster')[0]['remoteUrl']
			)

			if (type === 'missing') {
				const d = await radson.get_missing_series({
					series_id: Number(id),
				})
				setRecords(d.data)
			}
			if (Number(type) > 0) {
				const d = await radson.get_episodes({
					series_id: Number(id),
					season_number: Number(type),
				})
				setRecords(d.data)
				// console.log(JSON.stringify(r.data))
			}
		} catch (err) {
			console.log(err)
		}
	}

	useMemo(() => {
		; (async () => {
			await getData()
		})()
	}, [])

	const imgScale = 0.8

	return (
		<SafeAreaView
			style={{
				backgroundColor: Colors.backgroundPrimary,
			}}
			className="px-2 flex-1"
		>
			<View className="absolute">
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(false)
					}}
				>
					<View className="flex-1 bg-gray-800 mx-3 mb-3 rounded-lg">
						<ReactPressable
							className="my-3 px-3 bg-red-300"
							onPress={() => {
								setModalVisible(false)
							}}
						>
							<Text className="text-white text-xl">Close</Text>
						</ReactPressable>
						<FlatList
							scrollEnabled={true}
							data={interactiveData}
							keyExtractor={(e: any) => e['downloadUrl']}
							ItemSeparatorComponent={() => (
								<View style={{ height: 10 }} />
							)}
							renderItem={({ item }: any) => {
								// console.log(item)
								return (
									<View className="bg-gray-900">
										<Text className="text-white text-lg">
											Season Number:{' '}
											{item['seasonNumber']}
										</Text>
										<Text className="text-white text-lg">
											Episode(s):{' '}
											{item['mappedEpisodeInfo']
												.map((e) => e['episodeNumber'])
												.join(' ')}
										</Text>
										<Text className="text-white text-lg">
											Title: {item['seriesTitle']}
										</Text>
										<Text className="text-white text-lg">
											Seeders: {item['seeders']}
										</Text>
										<Text className="text-white text-lg">
											Leechers: {item['leechers']}
										</Text>
										<Text className="text-white text-lg">
											Quality:{' '}
											{item['quality']['quality']['name']}
										</Text>
										<Text className="text-white text-lg">
											Resolution:{' '}
											{
												item['quality']['quality'][
												'resolution'
												]
											}
										</Text>
										<Text className="text-white text-lg">
											Size:{' '}
											{Math.round(
												item['size'] / 1_073_741.824
											)}
											MB
										</Text>
										<Text className="text-white text-lg">
											Age: {item['age']} Days
										</Text>
										<ReactPressable
											className="bg-green-500 px-3 py-2 rounded"
											onPress={async () => {
												try {
													console.log(
														item['guid'],
														item['indexerId']
													)
													await radson.post_interactive_series(
														item['guid'],
														item['indexerId']
													)
													setModalVisible(false)
												} catch (err) {
													console.log(err)
												}
											}}
										>
											<Text className="text-xl text-white ">
												Start Download
											</Text>
										</ReactPressable>
									</View>
								)
							}}
						/>
					</View>
				</Modal>
			</View>
			<GestureHandlerRootView className="flex-1">
				<ScrollView>
					<View className="ml-auto mr-auto">
						<Image
							source={imgSrc}
							contentFit="cover"
							style={{
								width: width * 0.9 * imgScale,
								height: width * 1.6 * imgScale,
								borderRadius: 4,
							}}
						/>
					</View>
					{records.map((item) => (
						<View className="mt-5" key={item['id']}>
							<SwipableListItem
								leftCallback={async () => {
									if (item['monitored']) {
										console.log('delete item')
										await radson.monitor_series_individual(
											[item['id']],
											false
										)
										if (type === 'missing')
											setRecords((v) =>
												v.filter(
													(e) =>
														e['id'] !== item['id']
												)
											)
									} else {
										console.log('monitoring item')
										console.log(
											!localData!['seasons'].filter(
												(e) =>
													e['seasonNumber'] ===
													item['seasonNumber']
											)[0]['monitored']
										)
										if (
											!localData!['seasons'].filter(
												(e) =>
													e['seasonNumber'] ===
													item['seasonNumber']
											)[0]['monitored']
										) {
											const eps: number[] = []
											records.forEach((e) => {
												if (item[id] !== e['id'])
													eps.push(e['id'])
											})

											await radson.monitor_series_tmdb(
												localData!['tmdbId'],
												true,
												[item['seasonNumber']]
											)

											try {
												for (
													let x = 0;
													x < eps.length;
													x++
												) {
													// weird bug where it does not update correctly.
													await radson.monitor_series_individual(
														[eps[x]],
														false
													)
												}
											} catch (err) {
												console.log(err)
											}
										}
										await radson.monitor_series_individual(
											[item['id']],
											true
										)
									}
									await getData()
								}}
								rightCallback={async () => {
									console.log('start search')
									try {
										const r =
											await radson.get_interactive_queue_series_tmdb(
												localData!['tmdbId'],
												item['seasonNumber']
											)
										setInteractiveData(r.data)
										setModalVisible(true)
										console.log('done searching')
									} catch (err) {
										console.log(err)
									}
								}}
								leftView={
									item['monitored'] ? (
										<View className="bg-red-500 w-32 h-full rounded-lg absolute top-0 left-0 flex items-start justify-center pl-4">
											<TrashcanIcon
												size={32}
												color="white"
											/>
										</View>
									) : (
										<View className="bg-orange-500 w-32 h-full rounded-lg absolute top-0 left-0 flex items-start justify-center pl-4">
											<Bookmark size={32} color="white" />
										</View>
									)
								}
								rightView={
									<View className="bg-blue-500 w-32 h-full rounded-lg absolute top-0 right-0 flex items-end justify-center pr-4">
										<SearchIcon size={32} color="white" />
									</View>
								}
							>
								<View className="flex flex-row flex-1 relative">
									{item['monitored'] && (
										<View className="absolute top-0 right-0 z-50">
											<Bookmark
												size={15}
												color={'#f97316'}
											/>
										</View>
									)}
									<Text className="min-w-20 text-white font-bold text-lg">
										S{item.seasonNumber}E
										{item.episodeNumber}
									</Text>
									<Text className="text-white font-bold text-lg h-full">
										{' '}
										{item.title}
									</Text>
								</View>
							</SwipableListItem>
						</View>
					))}
				</ScrollView>
			</GestureHandlerRootView>
		</SafeAreaView>
	)
}

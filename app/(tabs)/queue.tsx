import { useSession } from '@/contexts/RadsonContext'
import Colors from '@/styles/Colors'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { View, Text, Pressable, Modal } from 'react-native'
import { Radson } from 'radson'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import SwipableListItem from '@/components/inputs/SwipableListItem'
import { Downloads } from '@/components/icons/Downloads'
import { TrashcanIcon } from '@/components/icons/Trashcan'
import { FlatList } from 'react-native-gesture-handler'

export default function QueueView() {
	const insets = useSafeAreaInsets()
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

	const [modalData, setModalData] = useState({
		visible: false,
		title: '',
		type: '' as 'tv' | 'movie',
	})
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
					visible={modalData.visible}
					onRequestClose={() => {
						modalData.visible = false
						setModalData({
							...modalData,
						})
					}}
				>
					<View style={styles.centeredView}>
						<View
							style={styles.modalView}
							className="flex flex-col gap-3"
						>
							<Text className="text-black font-black text-xl">
								{modalData.title}
							</Text>
							<Pressable className="bg-blue-400 rounded-full">
								<Text className="text-white text-lg px-3 py-2 font-bold">
									Start Interactive Search
								</Text>
							</Pressable>
							{modalData.type === 'tv' && (
								<Pressable className="bg-blue-400 rounded-full">
									<Text className="text-white text-lg px-3 py-2 font-bold">
										View Requested Episodes
									</Text>
								</Pressable>
							)}
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => {
									modalData.visible = false
									setModalData({
										...modalData,
									})
								}}
							>
								<Text style={styles.textStyle}>Dismiss</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
			</View>
			<GestureHandlerRootView>
				<View className="flex-1">
					{seriesRecords?.length > 0 && (
						<FlatList
							scrollEnabled={true}
							nestedScrollEnabled={true}
							contentContainerStyle={{
								paddingBottom: insets.bottom + 80,
							}}
							ListHeaderComponent={() => (
								<Text className="text-white text-3xl font-bold my-3">
									Requested Series
								</Text>
							)}
							data={Object.values(seriesDataSet)}
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
												setModalData({
													visible: true,
													type: 'tv',
													title: item['title'],
												})
											}}
											onPress={() => {
												router.navigate(
													`/viewer/tv/${item['tmdbId']}`
												)
											}}
										>
											<SwipableListItem
												leftCallback={() => {
													console.log('deleting item')
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
					)}
				</View>
			</GestureHandlerRootView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
})

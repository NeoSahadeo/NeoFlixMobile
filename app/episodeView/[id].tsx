import { useSession } from '@/contexts/RadsonContext'
import { useLocalSearchParams } from 'expo-router'
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
import { Downloads } from '@/components/icons/Downloads'
import { SearchIcon } from '@/components/icons/Search'

const dummy_data = {
	absoluteEpisodeNumbers: [],
	age: 666,
	ageHours: 15991.106006733555,
	ageMinutes: 959466.360404015,
	approved: false,
	commentUrl:
		'https://therarbg.to/post-detail/6d4ddd/wwe-ride-along-s05e02-love-and-smoke-720p-wwe-web-dl-aac2-0-x264-tepes-tgx/',
	customFormatScore: 0,
	customFormats: [],
	downloadAllowed: false,
	downloadUrl:
		'http://prowlarr:9696/4/download?apikey=1a7cc3d791d64a06899e2a1506eae9e9&link=aGpvMWpWV3FrRElSUEorbzBzVGMzaWFSNngyWmRuc1QzdDk5NUNFK01jOGdGWXVFc2F2djlMZmtxbVNKTHdiRWE4djE0anhHM24zOUVKNEkrOEw0UEpNaFFDalJ2UGkrS1h3ajUyMGhENWpIdzZ3V3hQa25mZlVIOTRuZEdHc0NqZkZiM0NWTTFBVnlhNitSSFhLNGdOb3hmTTRaZjU4bnVnV0dwMzlxUHlhTTQveGRBeDB4TFRHYkxqODdZb3FKQko0L2E1RzlHOVlsQTA5enhVMEpQRWRmRlFTTUFhZTdWNFhkdFNFOUFhb1Y0NnZtd2pNMGNCVjFNLzRLekNyam4wTDhkODNHMjlPbkJyZHNBTDlwMXNEZE4vSmxjblJXcmdicmYxM2xhdyt6STMxNDRFL0tHQm1KdlJhczd3UWswU2RKdXJOMjQ2ZWxGeDFFbTNyZk40ek9jRjhlbzlOR0FtbkY5MFkzMzJVLzRYbU90R3BFN1lGVkNsVjdGWWlYNGcrTGJ3d0Q4N1JIeXQyUlpRT3FGT25KZlp1U0FYTVZqNGZxRUhRWkhiSVE4YWtsdGhSTGhxMFN2SDR2azMwVWhnbVpxVTdyN2NyYmY4K1IyRVFJZEI4WlZTU21wUjBiLzMwSUZ0V1pUWXRhQ01nZG1HL2FCMW5RMmVUS1hQQWJEWk5Ca0d4MW9LR05RTDEzU2h0V3lOYlRnajZwbHBSaFBSVEhnVi9UR0NqV1VPRm5BckxtektCL253VDhaN0Y0bXJDbFZpODY2N1Jxb2RLdzczYjluVi9DNDBZc2x5cGYydXo0SkJxYWxXYjhFN05BUTh2bEg5cXRSSHVOT1ZQZlJCT0JEd1EzZzBMQnZTQ3B6RjNLU09tL3NsZFdORHhSNWVtNGgzaG9qdXRkQmozTjk2RG5acWFEL0FtMEtEQVMzaXpLbGI4Tjl3VWtpdDFERzlYK0VCR2F6SE5ydWVpaUJpNzdMQnNxOGdRNEpPMDd3WFRhcU5Dd3o3R1R0eHgzU2dDQVFOQkVVVzBSVzRYWlAvWktORzV1U1pLZmRMUmlFd2JSMTZqckFGSmlUU082SU9pZ21UKzdNakl1THR2YTc4V2M1N2ppNHRPVE1nN1B4RVhqaFBtUHg3WXVPaFZ0UDA2cis1TGNPQmFYUWdPSVBxRlBRT2M4b25NZjRXNjZYV0FZVDFBaU56UEwrRzl1c0Y3UmZtVjkyR0NLM3VSNk1URXdNQmljQnNnTDZnOG9DVFhQTFBCZ21YTlJwc2hCY3NQS3EvM3E4QTRiUTBFempCV1pUV2xSRnZDa3FuMjNqQU5UYTlLYkpOa0NkWGpXenAvd1VFKzhRZytwTit6Vmwvb3oxSEtscTFjL2NMVWQ4eGJocjBvRFduMG9oTldvZUFIN21xK3RORjhEd2lXVlFVeEdvTDYwS3B2dEZXOFRMZ3RMOVI3aEdNcVRPcVVEQzZsNnMvQi9SMnF6dmpmVGZmVUV6clJod3BaUVJidnRzdmVUT0JCeGRBZzIyRDJVUlpwS1p0NW0yQVhsTEpydFY3alNVOWtGekgvU01md3ZweEowckFLSGNRZk43Y1JkSlhqait2R2o3aE1jaHlNWDFzU0hEeFB3WndNWmk0VkQ5c1hhUzA2TVkvczJaT1BVRjRxWktndVE2aHQ5bUhNdHBCVzZvMEpUeERoMGZQbDlLSWJ5THF2UURlUkRKK2tzVkhmUzNFTzdhMTY1VkNNU28zS0RGeWZGanVHYmNZY1ZMSkkwallkZU5XTHlWOW5ld1hjaHJodTJiNG9XYUVYTkRhYTN0bjllZEJ2ZnNHdGg4WTlIM2R5YjUxcjZmQVNBSm9iemwzc3VPVGZTdFcyVFN5bkJiYzhjZEgwaDlsU1k3M0o3ekFCMFNCT3F4Q09LZkliakhpYTRtbllTUHVqM1lrNFRLQ3ZVSFNyMGEzWmlyaDg5N3VzbUFlaTdnQ09mT0R1eisrbHRUT3FMR3hZUWhNeWpYNWNSY2hFWFlaNkpmaE91TUUxQThBaUsybW45ZzBlSXQxRHZyS2p0NnJHaVdOVVlxTElsUU5HSzlSWWZobytwY2FaZ1FyK0tabUZTMGxzblJtTHl4UXA4Y056bnIweVFWTElKNHhsRm40Y3E1NFMyZ3c9PQ&file=WWE+Ride+Along+S05E02+Love+and+Smoke+720p+WWE+WEB+DL+AAC2+0+x264+TEPES+TGx',
	episodeNumbers: [2],
	episodeRequested: false,
	fullSeason: false,
	guid: 'magnet:?xt=urn:btih:4258594F4AADA60F3B4808549B5ED2709705BACD&dn=WWE+Ride+Along+S05E02+Love+and+Smoke+720p+WWE+WEB+DL+AAC2+0+x264+TEPES+TGx&tr=http%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce&tr=udp%3a%2f%2ftracker.auctor.tv%3a6969%2fannounce&tr=udp%3a%2f%2fopentracker.i2p.rocks%3a6969%2fannounce&tr=https%3a%2f%2fopentracker.i2p.rocks%3a443%2fannounce&tr=udp%3a%2f%2fopen.demonii.com%3a1337%2fannounce&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a6969%2fannounce&tr=http%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2fopen.stealth.si%3a80%2fannounce&tr=udp%3a%2f%2ftracker.torrent.eu.org%3a451%2fannounce&tr=udp%3a%2f%2ftracker.moeking.me%3a6969%2fannounce&tr=udp%3a%2f%2fexplodie.org%3a6969%2fannounce&tr=udp%3a%2f%2fexodus.desync.com%3a6969%2fannounce&tr=udp%3a%2f%2fuploads.gamecoast.net%3a6969%2fannounce&tr=udp%3a%2f%2ftracker1.bt.moack.co.kr%3a80%2fannounce&tr=udp%3a%2f%2ftracker.tiny-vps.com%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.theoks.net%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.skyts.net%3a6969%2fannounce&tr=udp%3a%2f%2ftracker-udp.gbitt.info%3a80%2fannounce&tr=udp%3a%2f%2fopen.tracker.ink%3a6969%2fannounce&tr=udp%3a%2f%2fmovies.zsw.ca%3a6969%2fannounce',
	imdbId: 'tt5432256',
	indexer: 'TheRARBG (Prowlarr)',
	indexerFlags: 1,
	indexerId: 3,
	infoHash: '4258594F4AADA60F3B4808549B5ED2709705BACD',
	infoUrl:
		'https://therarbg.to/post-detail/6d4ddd/wwe-ride-along-s05e02-love-and-smoke-720p-wwe-web-dl-aac2-0-x264-tepes-tgx/',
	isAbsoluteNumbering: false,
	isDaily: false,
	isPossibleSpecialEpisode: false,
	languageWeight: 0,
	languages: [
		{
			id: 0,
			name: 'Unknown',
		},
	],
	leechers: 1,
	magnetUrl: '',
	mappedAbsoluteEpisodeNumbers: [],
	mappedEpisodeInfo: [],
	mappedEpisodeNumbers: [],
	protocol: 'torrent',
	publishDate: '2023-10-28T02:16:38Z',
	quality: {
		quality: {
			id: 5,
			name: 'WEBDL-720p',
			resolution: 720,
			source: 'web',
		},
		revision: {
			isRepack: false,
			real: 0,
			version: 1,
		},
	},
	qualityWeight: 901,
	rejected: true,
	rejections: ['Unknown Series'],
	releaseHash: '',
	releaseWeight: 49,
	sceneSource: false,
	seasonNumber: 5,
	seeders: 0,
	seriesTitle: 'WWE Ride Along',
	size: 535402912,
	special: false,
	temporarilyRejected: false,
	title: 'WWE Ride Along S05E02 Love and Smoke 720p WWE WEB DL AAC2 0 x264 TEPES TGx',
	tvRageId: 0,
	tvdbId: 0,
}

export default function() {
	const { id } = useLocalSearchParams()
	const { width } = useWindowDimensions()

	const { radson }: { radson: Radson } = useSession()

	const [interactiveData, setInteractiveData] = useState<any>([])
	const [localData, setLocalData] = useState(null)
	const [records, setRecords] = useState<any[]>([])
	const [imgSrc, setImgSrc] = useState(null)
	const [modalVisible, setModlaVisible] = useState(false)

	useMemo(() => {
		; (async () => {
			try {
				const data: any[] = []
				let x = 1
				for (; ;) {
					const r = await radson.get_missing_series({
						page: x++,
					})
					r.data['records'].forEach((e, i) => {
						if (Number(e['seriesId']) == Number(id)) {
							data.push(r.data['records'][i])
						}
					})
					if (r.data['records'].length == 0) {
						break
					}
				}
				setRecords(data)

				const r = await radson.fetch_local_data('series', 'local', id)
				setLocalData(r.data)
				setImgSrc(
					r.data['images']
						.filter((e) => Object.keys(e).includes('coverType'))
						.filter((e) => e['coverType'] === 'poster')[0][
					'remoteUrl'
					]
				)
			} catch (err) {
				console.log(err)
			}
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
						setModlaVisible(false)
					}}
				>
					<View className="flex-1 bg-gray-800">
						<FlatList
							scrollEnabled={true}
							data={interactiveData}
							keyExtractor={(e: any) => e['downloadUrl']}
							ItemSeparatorComponent={() => (
								<View style={{ height: 10 }} />
							)}
							renderItem={({ item }: any) => {
								return (
									<View className="bg-gray-900">
										<Text className="text-white text-lg">
											Season Number:{' '}
											{item['seasonNumber']}
										</Text>
										<Text className="text-white text-lg">
											Episodes: {item['episodeNumbers']}
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
										<ReactPressable className="bg-green-500 px-3 py-2 rounded">
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
								leftCallback={() => {
									console.log('delete item')
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
										setModlaVisible(true)
										console.log('done searching')
									} catch (err) {
										console.log(err)
									}
								}}
								leftView={
									<View className="bg-red-500 w-32 h-full rounded-lg absolute top-0 left-0 flex items-start justify-center pl-4">
										<TrashcanIcon size={32} color="white" />
									</View>
								}
								rightView={
									<View className="bg-blue-500 w-32 h-full rounded-lg absolute top-0 right-0 flex items-end justify-center pr-4">
										<SearchIcon size={32} color="white" />
									</View>
								}
							>
								<View className="flex flex-row flex-1">
									<Text className="min-w-20 text-white font-bold text-lg">
										S{item.seasonNumber}E
										{item.episodeNumber}
									</Text>
									<Text className="text-white font-bold text-lg">
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

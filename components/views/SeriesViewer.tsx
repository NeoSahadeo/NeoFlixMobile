import { SafeAreaView } from 'react-native-safe-area-context'
import {
    ScrollView,
    Text,
    View,
    Pressable,
    FlatList,
    useWindowDimensions,
} from 'react-native'
import Colors from '@/styles/Colors'
import { Image } from 'expo-image'
import { resolveImage } from '@/scripts/urlUtils'
import { TrashcanIcon } from '@/components/icons/Trashcan'
import { PlusIcon } from '@/components/icons/Plus'
import { useEffect, useState } from 'react'
import { Radson } from 'radson'
import { router } from 'expo-router'

const monitor = async (radson: Radson, localData: any, index: any) => {
    try {
        await radson.monitor_series_tmdb(localData.tmdbId, true, [index])
    } catch (err) {
        console.log(err)
    }
}

const remove_monitor = async (radson: Radson, localData: any, index: any) => {
    try {
        await radson.monitor_series_tmdb(localData.tmdbId, false, [index])
    } catch (err) {
        console.log(err)
    }
}

export default function({
    localData,
    tmdbData,
    radson,
    refreshFunc,
}: {
    localData: any
    tmdbData: any
    radson: Radson
    refreshFunc: () => void
}) {
    const [seasonalPosters, setSeasonalPosters] = useState()

    const { width } = useWindowDimensions()

    const mainSize = width * 0.8
    const miniSize = width * 0.4

    const [numColumns, setNumColumns] = useState(2)
    const [colSize, setColSize] = useState(0)
    useEffect(() => {
        if (width < 250) setNumColumns(1)
        else if (width < 600) setNumColumns(2)
        else setNumColumns(3)

        setColSize(Math.floor(width / numColumns))
    }, [width])

    useEffect(() => {
        if (!tmdbData && !localData) return
        setSeasonalPosters(tmdbData.seasons)
    }, [tmdbData])

    return (
        <SafeAreaView
            className="flex-1 px-3"
            style={{
                backgroundColor: Colors.backgroundPrimary,
            }}
        >
            <ScrollView>
                <View className="flex gap-2 items-center mb-10">
                    <Text className="text-3xl text-white font-bold">
                        {tmdbData.name}
                    </Text>
                    <Image
                        source={resolveImage(tmdbData.poster_path, 'small')}
                        contentFit="cover"
                        style={{
                            width: mainSize * 0.9,
                            height: mainSize * 1.6,
                            margin: 3,
                            borderRadius: 7,
                        }}
                    />
                    <View className="flex-1 flex flex-row justify-around gap-10">
                        <Text className="text-gray-400 text-lg font-black">
                            {tmdbData.first_air_date}
                        </Text>
                        <Text className="text-gray-400 text-lg font-black">
                            {`${tmdbData.number_of_seasons} Season${tmdbData.number_of_seasons > 1 ? 's' : ''}`}
                        </Text>
                    </View>
                    <Text className="font-bold text-white self-start mt-3">
                        Description:
                    </Text>
                    <Text className="text-white text-lg">
                        {tmdbData.overview}
                    </Text>
                    <View className="flex-1 items-start w-full mt-5">
                        <FlatList
                            data={seasonalPosters}
                            keyExtractor={(e: any) => e['tmdbId']}
                            renderItem={({ item, index }) => {
                                return (
                                    <View className="relative">
                                        <Pressable
                                            onPress={async () => {
                                                try {
                                                    const r =
                                                        await radson.monitor_series_tmdb(
                                                            localData['tmdbId'],
                                                            true,
                                                            [-1]
                                                        )
                                                    router.navigate(
                                                        `/episodeView/${r.data['id']}`
                                                    )
                                                } catch (err) {
                                                    console.log(err)
                                                }
                                            }}
                                        >
                                            <Image
                                                source={resolveImage(
                                                    item.poster_path,
                                                    'small'
                                                )}
                                                contentFit="cover"
                                                style={{
                                                    width: miniSize * 0.9,
                                                    height: miniSize * 1.6,
                                                    margin: 3,
                                                    borderRadius: 7,
                                                }}
                                            />
                                            <Text className="text-white text-wrap max-w-32">
                                                {item.name}
                                            </Text>
                                            {localData.seasons.filter(
                                                (e) =>
                                                    e['seasonNumber'] ===
                                                    item['season_number']
                                            )[0]['monitored'] &&
                                                localData.id !== undefined ? (
                                                <Pressable
                                                    onPress={async () => {
                                                        await remove_monitor(
                                                            radson,
                                                            localData,
                                                            item[
                                                            'season_number'
                                                            ]
                                                        )

                                                        refreshFunc()
                                                    }}
                                                    className="absolute bg-red-600 px-3 py-3 flex items-center right-0 mr-3 rounded-full mb-3 bottom-0"
                                                >
                                                    <TrashcanIcon
                                                        size={24}
                                                        color={'white'}
                                                    />
                                                </Pressable>
                                            ) : (
                                                <Pressable
                                                    onPress={async () => {
                                                        await monitor(
                                                            radson,
                                                            localData,
                                                            item[
                                                            'season_number'
                                                            ]
                                                        )
                                                        refreshFunc()
                                                    }}
                                                    className="absolute bg-green-600 px-3 py-3 flex items-center right-0 mr-3 rounded-full mb-3 bottom-0"
                                                >
                                                    <PlusIcon
                                                        size={24}
                                                        color="white"
                                                    />
                                                </Pressable>
                                            )}
                                        </Pressable>
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

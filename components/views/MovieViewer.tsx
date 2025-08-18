import { SafeAreaView } from 'react-native-safe-area-context'
import {
    ScrollView,
    Text,
    View,
    Pressable,
    useWindowDimensions,
} from 'react-native'
import Colors from '@/styles/Colors'
import { Image } from 'expo-image'
import { resolveImage } from '@/scripts/urlUtils'
import { useEffect, useState } from 'react'
import { Radson } from 'radson'
import { PlusIcon } from '@/components/icons/Plus'
import { TrashcanIcon } from '@/components/icons/Trashcan'

const monitor = async (radson: Radson, localData: any) => {
    try {
        await radson.monitor_movie_tmdb(localData.tmdbId, true)
    } catch (err) {
        console.log(err)
    }
}

const remove_monitor = async (radson: Radson, localData: any) => {
    try {
        await radson.monitor_movie_tmdb(localData.tmdbId, false)
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
    const [posterPath, setPosterPath] = useState(null)

    const { width } = useWindowDimensions()
    const mainSize = width * 0.8
    useEffect(() => {
        setPosterPath(
            localData['images'].filter(
                (e: any) => e['coverType'] === 'poster'
            )[0]['remoteUrl']
        )
    }, [])

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
                        {localData.originalTitle}
                    </Text>
                    <Image
                        source={resolveImage(posterPath ?? '', 'small')}
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
                            {localData.year}
                        </Text>
                    </View>
                    <Text className="font-bold text-white self-start mt-3">
                        Description:
                    </Text>
                    <Text className="text-white text-lg">
                        {localData.overview}
                    </Text>
                </View>
                <View>
                    {localData.monitored ? (
                        <Pressable
                            className="bg-red-500 px-3 py-2 rounded  w-32 flex items-center justify-center flex-row gap-3"
                            onPress={async () => {
                                await remove_monitor(radson, localData)
                                refreshFunc()
                            }}
                        >
                            <TrashcanIcon size={24} color={'white'} />
                            <Text className="text-white">Remove</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            className="bg-green-500 px-3 py-2 rounded  w-32 flex items-center justify-center flex-row gap-3"
                            onPress={async () => {
                                await monitor(radson, localData)
                                refreshFunc()
                            }}
                        >
                            <PlusIcon size={24} color="white" />
                            <Text className="text-white">Add</Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

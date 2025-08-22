import { SafeAreaView } from 'react-native-safe-area-context'
import {
    FlatList,
    Pressable,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native'
import { useEffect, useState, useMemo, useRef } from 'react'
import Colors from '@/styles/Colors'
import { fetchTrending, search as searchTMDB } from '@/scripts/tmdbApi'
import { useSession } from '@/contexts/AuthContext'
import DefaultPoster from '@/components/posters/DefaultPoster'
import DropdownTimeWindow from '@/components/buttons/DropdownTimeWindow'
import DropdownTrending from '@/components/buttons/DropdownTrending'
import { router } from 'expo-router'
import { SearchIcon } from '@/components/icons/Search'
import { useDebouncedCallback } from 'use-debounce'

export default function HomePage() {
    const { apiKey } = useSession()
    const [posters, setPosters] = useState([])
    const [trendingType, setTrendingType] = useState<'tv' | 'movie' | 'all'>(
        'all'
    )
    const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day')

    const [search, setSearch] = useState('')
    const debounced = useDebouncedCallback(
        // function
        (value) => {
            setSearch(value)
        },
        // delay in ms
        1000
    )

    const [isRefreshing, setIsRefreshing] = useState(false)
    const [page, setPage] = useState(1)
    const flatListRef = useRef(null)

    useMemo(() => {
        if (!search) {
            ; (async () => {
                const r = await fetchTrending(
                    apiKey,
                    trendingType,
                    timeWindow,
                    page
                )
                if (r) setPosters((v) => [...v, ...r.results])
                setIsRefreshing(false)
            })()
        } else {
            ; (async () => {
                const r = (await searchTMDB(apiKey, search)) as any
                let arr = [] as any
                r?.tv.results.forEach((e) => {
                    e.media_type = 'tv'
                })
                r?.movie.results.forEach((e) => {
                    e.media_type = 'movie'
                })
                if (trendingType == 'tv') {
                    arr.push(...r?.tv.results)
                }
                if (trendingType == 'movie') {
                    arr.push(...r?.movie.results)
                }
                if (trendingType == 'all') {
                    arr.push(...r?.tv.results, ...r?.movie.results)
                }
                arr = arr.filter((e) => typeof e.poster_path == 'string') // removes non poster path elements
                // fix this
                setPosters((v) => {
                    if (
                        v.length !== arr.length ||
                        !v.every((val, i) => val === arr[i])
                    ) {
                        return [...v, ...arr]
                    }
                    return v // no change if arrays are equal
                })
                setIsRefreshing(false)
            })()
        }
    }, [timeWindow, trendingType, search, page])

    const { width } = useWindowDimensions()
    const [numColumns, setNumColumns] = useState(2)
    const [colSize, setColSize] = useState(0)

    useEffect(() => {
        if (width < 250) setNumColumns(1)
        else if (width < 600) setNumColumns(2)
        else setNumColumns(3)

        setColSize(Math.floor(width / numColumns))
    }, [width])

    useEffect(() => {
        setPage(1)
        setPosters([])
        flatListRef.current.scrollToOffset({ offset: 0, animated: true })
    }, [trendingType, timeWindow, search])

    return (
        <SafeAreaView
            style={{
                backgroundColor: Colors.backgroundPrimary,
            }}
            className="flex-1 items-center"
        >
            <View className="flex flex-row gap-3 my-3 pr-4 w-full">
                <View className="flex flex-row items-center gap-2 pl-3  bg-blue-900 flex-1 rounded-full">
                    <SearchIcon size={24} color="white" />
                    <TextInput
                        onChangeText={(e) => {
                            debounced(e)
                        }}
                        placeholder="Search"
                        className="text-white placeholder:text-white w-full"
                    />
                </View>
                <View className="ml-auto flex-row flex gap-2">
                    <DropdownTimeWindow
                        value={timeWindow}
                        setValue={setTimeWindow}
                    />
                    <DropdownTrending
                        value={trendingType}
                        setValue={setTrendingType}
                    />
                </View>
            </View>
            <FlatList
                ref={flatListRef}
                data={posters}
                scrollEnabled={true}
                keyExtractor={(contact, index) => String(index)}
                renderItem={({ item }) => {
                    if (typeof item.poster_path !== 'string') return
                    return (
                        <Pressable
                            onPress={() => {
                                console.log(typeof item.poster_path)
                                // console.log(item.media_type, item.id, item.poster_path, item)
                                router.navigate(
                                    `/viewer/${item.media_type}/${item.id}`
                                )
                            }}
                        >
                            <DefaultPoster
                                alt={item.title}
                                colSize={colSize}
                                src={item.poster_path}
                            />
                        </Pressable>
                    )
                }}
                numColumns={numColumns}
                onEndReached={() => {
                    console.log('end reached')
                    setIsRefreshing(true)
                    setPage(page + 1)
                }}
                onEndReachedThreshold={0.5}
            />
            {isRefreshing == true && (
                <View className="w-full h-28 bg-transparent absolute bottom-10 flex-1 items-center">
                    <Text className="text-white bg-blue-800 px-5 py-3 rounded-lg">
                        Refreshing
                    </Text>
                </View>
            )}
            <View className="w-full h-28 bg-transparent"></View>
        </SafeAreaView>
    )
}

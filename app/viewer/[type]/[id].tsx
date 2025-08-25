import { useLocalSearchParams } from 'expo-router'
import { Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/styles/Colors'
import { useSession } from '@/contexts/AuthContext'
import axios, { AxiosResponse } from 'axios'
import { Radson } from 'radson'
import MovieViewer from '@/components/views/MovieViewer'
import SeriesViewer from '@/components/views/SeriesViewer'

export default function ViewerScreen() {
    const { type, id } = useLocalSearchParams()

    const [radson, setRadson] = useState<Radson>()

    const [tmdbData, setTMDBData] = useState<any>(null)
    const [localData, setLocalData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { apiKey } = useSession()

    const refreshData = async () => {
        try {
            let tmdb_resp: AxiosResponse<any, any> = null as any
            let local_resp: AxiosResponse<any, any> = null as any
            if (type === 'tv') {
                tmdb_resp = await axios.get(
                    'https://api.themoviedb.org/3/tv/' + id,
                    { headers: { Authorization: `Bearer ${apiKey}` } }
                )
                local_resp = (await radson?.lookup_sonarr_tmdb(
                    Number(id)
                )) as any
            } else {
                tmdb_resp = await axios.get(
                    'https://api.themoviedb.org/3/movie/' + id,
                    { headers: { Authorization: `Bearer ${apiKey}` } }
                )
                local_resp = (await radson?.lookup_radarr_tmdb(
                    Number(id)
                )) as any

                // fix because the radarr api is broken.
                const r = await radson?.fetch_local_data(
                    'movie',
                    'tmdb',
                    local_resp.data['tmdbId']
                )
                if (r?.data) local_resp.data['monitored'] = r?.data['monitored']
            }
            if (tmdb_resp) setTMDBData(tmdb_resp.data)
            if (local_resp) setLocalData(local_resp.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        ; (async () => {
            try {
                const sonarr_address =
                    (await AsyncStorage.getItem('sonarrAddress')) ??
                    'http://127.0.0.1:0000'
                const sonarr_api_key =
                    (await SecureStore.getItemAsync('sonarrApiKey')) ?? ''
                const radarr_address =
                    (await AsyncStorage.getItem('radarrAddress')) ??
                    'http://127.0.0.1:0000'
                const radarr_api_key =
                    (await SecureStore.getItemAsync('radarrApiKey')) ?? ''

                // console.log({
                //     sonarr_address,
                //     sonarr_api_key,
                //     radarr_address,
                //     radarr_api_key,
                // })

                setRadson(
                    new Radson({
                        sonarr_address,
                        sonarr_api_key,
                        radarr_address,
                        radarr_api_key,
                    })
                )
            } catch (error) {
                console.error('Error loading data:', error)
            }
        })()
    }, [])

    useEffect(() => {
        ; (async () => {
            await refreshData()
        })()
    }, [radson])

    if (loading) {
        // Optionally show a loader while fetching data
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.backgroundPrimary,
                }}
            >
                <Text className="text-white text-2xl">Loading...</Text>
            </SafeAreaView>
        )
    }

    if (!localData || !tmdbData) {
        // Show fallback UI if no data found or error occured
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.backgroundPrimary,
                }}
            >
                <Text className="text-white text-2xl">No data available.</Text>
            </SafeAreaView>
        )
    } else {
        if (type == 'tv') {
            return (
                <SeriesViewer
                    radson={radson!}
                    localData={localData[0]}
                    tmdbData={tmdbData}
                    refreshFunc={refreshData}
                />
            )
        }
        if (type == 'movie') {
            return (
                <MovieViewer
                    radson={radson!}
                    localData={localData}
                    tmdbData={tmdbData}
                    refreshFunc={refreshData}
                />
            )
        }
    }
}

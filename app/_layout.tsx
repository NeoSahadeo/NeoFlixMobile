import '../global.css'

import { LogBox } from 'react-native'

import { Stack } from 'expo-router'
import { useSession, SessionProvider } from '@/contexts/AuthContext'
import {
    useSession as radsonUseSession,
    SessionProvider as RadsonSessionProvider,
} from '@/contexts/RadsonContext'
import { useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

import { Radson } from 'radson'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

export default function Root() {
    return (
        <SafeAreaProvider>
            <SessionProvider>
                <RadsonSessionProvider>
                    <RootNavigator />
                </RadsonSessionProvider>
            </SessionProvider>
        </SafeAreaProvider>
    )
}

function RootNavigator() {
    const { apiKey, getAuthToken } = useSession()
    const { setRadson } = radsonUseSession()

    useEffect(() => {
        ; (async () => {
            getAuthToken()
        })()
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

    return (
        <>
            <StatusBar style="auto" />
            <Stack>
                <Stack.Protected guard={apiKey}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="viewer"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="episodeView"
                        options={{ headerShown: false }}
                    />
                </Stack.Protected>

                <Stack.Protected guard={!apiKey}>
                    <Stack.Screen
                        name="login"
                        options={{ headerShown: false }}
                    />
                </Stack.Protected>
            </Stack>
        </>
    )
}

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
])

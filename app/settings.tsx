import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Pressable,
    Platform,
    Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

import ThemedTextInput from '@/components/form/TextInput'
import Colors from '@/styles/Colors'
import PageTitle from '@/components/headings/PageTitle'
import { useEffect, useState } from 'react'
import SaveButton from '@/components/buttons/SaveButton'
import { useSession } from '@/contexts/AuthContext'

export default function Settings() {
    const { logout, logoutall } = useSession()

    const [formHasChanged, setFormHasChanged] = useState(false)
    const [sonarrAddress, setSonarrAddress] = useState<any>({
        prev: '',
        new: '',
    })
    const [radarrAddress, setRadarrAddress] = useState<any>({
        prev: '',
        new: '',
    })
    const [sonarrApiKey, setSonarrApiKey] = useState<any>({ prev: '', new: '' })
    const [radarrApiKey, setRadarrApiKey] = useState<any>({ prev: '', new: '' })

    const updateData = async () => {
        await AsyncStorage.setItem('sonarrAddress', sonarrAddress.new)
        await AsyncStorage.setItem('radarrAddress', radarrAddress.new)
        await SecureStore.setItemAsync('sonarrApiKey', sonarrApiKey.new)
        await SecureStore.setItemAsync('radarrApiKey', radarrApiKey.new)
        setFormHasChanged(false)
        await fetchData()
    }

    const fetchData = async () => {
        const _sa = (await AsyncStorage.getItem('sonarrAddress')) ?? ''
        setSonarrAddress({ prev: _sa, new: _sa })

        const _sk = (await SecureStore.getItemAsync('sonarrApiKey')) ?? ''
        setSonarrApiKey({ prev: _sk, new: _sk })

        const _ra = (await AsyncStorage.getItem('radarrAddress')) ?? ''
        setRadarrAddress({ prev: _ra, new: _ra })

        const _rk = (await SecureStore.getItemAsync('radarrApiKey')) ?? ''
        setRadarrApiKey({ prev: _rk, new: _rk })
    }

    useEffect(() => {
        ;(async () => {
            await fetchData()
        })()
    }, [])
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                backgroundColor: Colors.backgroundPrimary,
            }}
            className="flex-1 px-2 pt-10"
        >
            <ScrollView>
                <View className="flex flex-col gap-3">
                    <PageTitle title={'Settings'} className="text-3xl" />
                    <View
                        className="px-3 py-2 rounded-lg"
                        style={{ borderWidth: 1, borderColor: '#4b4c4c' }}
                    >
                        <Text className="text-sm text-white">Sonarr</Text>
                        <ThemedTextInput
                            placeholder="Sonarr Address"
                            onChangeText={(e) => {
                                setFormHasChanged(e !== sonarrAddress.prev)
                                setSonarrAddress({
                                    prev: sonarrAddress.prev,
                                    new: e,
                                })
                            }}
                            value={sonarrAddress.new}
                        />
                        <ThemedTextInput
                            placeholder="Sonarr Api Key"
                            onChangeText={(e) => {
                                setFormHasChanged(e !== sonarrApiKey.prev)
                                setSonarrApiKey({
                                    prev: sonarrApiKey.prev,
                                    new: e,
                                })
                            }}
                            value={sonarrApiKey.new}
                        />
                    </View>
                    <View
                        className="px-3 py-2 rounded-lg"
                        style={{ borderWidth: 1, borderColor: '#4b4c4c' }}
                    >
                        <Text className="text-sm text-white">
                            Radarr Address
                        </Text>
                        <ThemedTextInput
                            placeholder="Radarr Address"
                            onChangeText={(e) => {
                                setFormHasChanged(e !== radarrAddress.prev)
                                const updateRadarrAddress = {
                                    prev: radarrAddress.prev,
                                    new: e,
                                }
                                setRadarrAddress(updateRadarrAddress)
                            }}
                            value={radarrAddress.new}
                        />
                        <ThemedTextInput
                            placeholder="Radarr Api Key"
                            onChangeText={(e) => {
                                setFormHasChanged(e !== radarrApiKey.prev)
                                setRadarrApiKey({
                                    prev: radarrApiKey.prev,
                                    new: e,
                                })
                            }}
                            value={radarrApiKey.new}
                        />
                    </View>
                </View>
                <View className="flex flex-col gap-3 mt-10">
                    <Pressable
                        className="bg-red-700 max-w-32 px-2 py-3 items-center rounded-lg"
                        android_ripple={{ color: 'red' }}
                        onPress={() => {
                            Alert.alert(
                                'Confirm',
                                'Are you sure you want to proceed?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Logout', onPress: logout },
                                ]
                            )
                        }}
                    >
                        <Text className="font-bold text-xl text-red-200">
                            Logout
                        </Text>
                    </Pressable>
                    <Pressable
                        className="bg-red-700 max-w-52 px-2 py-3 items-center rounded-lg"
                        android_ripple={{ color: 'red' }}
                        onPress={async () => {
                            Alert.alert(
                                'Confirm',
                                'Are you sure you want to proceed? This will logout all logged in devices!',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Logout all devices',
                                        onPress: logoutall,
                                    },
                                ]
                            )
                        }}
                    >
                        <Text className="font-bold text-xl text-red-200 text-nowrap">
                            Logout all devices
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
            {formHasChanged ? (
                <SaveButton
                    callback={updateData}
                    label="Save"
                    className="absolute bottom-20 right-4"
                />
            ) : null}
        </KeyboardAvoidingView>
    )
}

import {
    View,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TouchableHighlight,
    Linking,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'

import Logo from '@/components/icons/Logo'
import ThemedTextInput from '@/components/form/TextInput'

import { useSession } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

function needHelp() {
    Linking.openURL('https://example.com')
}

export default function LoginScreen() {
    const { control, handleSubmit } = useForm()
    const { getAuthToken } = useSession()

    const [backendAddress, setBackendAddress] = useState('')

    useEffect(() => {
        ;(async () => {
            const b = (await AsyncStorage.getItem('backendAddress')) ?? ''
            setBackendAddress(b)
        })()
    }, [])

    async function login(data: any) {
        if (!data.password || !backendAddress || !data.username) return

        try {
            const response = await axios({
                url: backendAddress + '/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    username: data.username,
                    password: data.password,
                },
            })
            if (response.status == 200) {
                await SecureStore.setItemAsync(
                    'loginToken',
                    response.data['access_token']
                )
                await AsyncStorage.setItem('backendAddress', backendAddress)
                getAuthToken()
            }
        } catch (error) {
            console.log('Login error:', error)
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                flex: 1,
                backgroundColor: '#000711',
            }}
            className="items-center justify-center gap-3"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <View className="mb-10">
                <Logo size={150} />
                <Text className="text-3xl text-white">NeoFlix Login</Text>
            </View>
            <View className="flex w-full px-10 gap-3 mb-10">
                <Controller
                    control={control}
                    name="serverAddress"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ThemedTextInput
                            placeholder="Server Address"
                            onChangeText={setBackendAddress}
                            onBlur={onBlur}
                            value={backendAddress}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ThemedTextInput
                            placeholder="Username"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ThemedTextInput
                            placeholder="Password"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            className="mb-10"
                            secureTextEntry={false}
                        />
                    )}
                />
                <Pressable
                    className="px-10 py-5 bg-blue-500 rounded w-auto flex items-center"
                    android_ripple={{ color: 'cyan' }}
                    onPress={handleSubmit(login)}
                >
                    <Text className="font-black text-white">Login</Text>
                </Pressable>
            </View>
            <TouchableHighlight onPress={needHelp}>
                <Text className="text-blue-100">Need Help?</Text>
            </TouchableHighlight>
        </KeyboardAvoidingView>
    )
}

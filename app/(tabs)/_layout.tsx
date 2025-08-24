import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import SolarFireBold from '@/components/icons/SolarFireBold'
import { BlurView } from '@react-native-community/blur'

import Colors from '@/styles/Colors'
import { useWindowDimensions } from 'react-native'
import { Downloads } from '@/components/icons/Downloads'
import { Queue } from '@/components/icons/Queue'

export default function TabLayout() {
    const { width } = useWindowDimensions()
    return (
        <Tabs
            initialRouteName="trending"
            screenOptions={{
                tabBarActiveTintColor: '#36909D',
                tabBarStyle: {
                    backgroundColor: `${Colors.backgroundPrimary}A0`,
                    borderWidth: 0,
                    borderTopWidth: 0,
                    height: 65,
                    paddingTop: 7,
                    borderRadius: 100,
                    position: 'absolute',
                    bottom: 4,
                    width: width - 20,
                    marginLeft: 10,
                },
            }}
        >
            <Tabs.Screen
                name="trending"
                options={{
                    title: 'Trending',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <SolarFireBold size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="queue"
                options={{
                    title: 'Queue',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Queue size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="downloads"
                options={{
                    title: 'Downloads',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Downloads size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}

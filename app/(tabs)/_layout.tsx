import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import SolarFireBold from '@/components/icons/SolarFireBold'

import Colors from '@/styles/Colors'
import { useWindowDimensions } from 'react-native'

export default function TabLayout() {
    const { width } = useWindowDimensions()
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#36909D',
                tabBarStyle: {
                    backgroundColor: Colors.backgroundPrimary,
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
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
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
                name="settings"
                options={{
                    title: 'Settings',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}

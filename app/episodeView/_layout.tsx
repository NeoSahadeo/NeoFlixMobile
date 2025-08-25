import { Stack } from 'expo-router'
import Colors from '@/styles/Colors'

export default function ViewerLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="[type]/[id]"
				options={{
					headerStyle: {
						backgroundColor: Colors.backgroundPrimary,
					},
					headerTintColor: '#fff',
					headerTitle: '',
				}}
			/>
		</Stack>
	)
}

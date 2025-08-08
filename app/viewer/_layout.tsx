import { Stack } from 'expo-router';

export default function ViewerLayout() {
	return (
		<Stack>
			<Stack.Screen name="[type]/[id]" options={{ headerTitle: '', }} />
		</Stack>
	)
}

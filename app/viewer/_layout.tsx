
import { Stack } from 'expo-router';

export default function ViewerLayout() {
	return (
		<Stack>
			<Stack.Screen name="[id]" options={{ headerTitle: '', }} />
		</Stack>
	)
}

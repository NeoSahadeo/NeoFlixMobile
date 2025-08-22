import { useLocalSearchParams } from 'expo-router'

export default function() {
	const { type, id } = useLocalSearchParams()
}

import { SafeAreaView } from "react-native-safe-area-context"

import Colors from "@/styles/Colors"
export default function HomePage() {
	return (
		<SafeAreaView style={{
			backgroundColor: Colors.backgroundPrimary
		}}
			className="flex-1 items-center"
		>
		</SafeAreaView>
	)
}

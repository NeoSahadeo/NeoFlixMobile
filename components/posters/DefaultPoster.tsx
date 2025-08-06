import { Image } from "expo-image"
import { resolveImage } from "@/scripts/urlUtils"

export default ({ src, colSize }: any) => {
	return (
		<Image
			source={resolveImage(src, "small")}
			contentFit="cover"
			style={{ width: colSize * 0.9, height: colSize * 1.6, margin: 3, borderRadius: 7 }}
		/>
	)
}

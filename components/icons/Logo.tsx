import icon from "@/assets/images/icon.png"
import { Image } from 'expo-image';
export default ({ size }: { size: number }) => {
	return (
		<Image
			source={icon}
			contentFit="cover"
			style={{ width: size, height: size }}
		/>
	);
}

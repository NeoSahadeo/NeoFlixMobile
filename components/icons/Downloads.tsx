import Svg, { Path } from 'react-native-svg'

export function Downloads({ size, color }: any) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<Path fill={color} d="M4 22v-2h16v2zm8-4L5 9h4V2h6v7h4z" />
		</Svg>
	)
}

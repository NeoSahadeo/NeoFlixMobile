import Svg, { Path, G, Symbol } from 'react-native-svg'

export function Bookmark({ size, color }: any) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<Path
				fill={color}
				d="M5 21V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v16l-7-3z"
			/>
		</Svg>
	)
}

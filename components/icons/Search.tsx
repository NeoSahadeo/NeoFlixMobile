import Svg, { Path } from 'react-native-svg';
export function SearchIcon({ size, color }: any) {
	return (
		<Svg width={size} height={size} viewBox="0 0 20 20">{/* Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE */}<Path fill={color} fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11M2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9" clipRule="evenodd"></Path></Svg>
	)
}

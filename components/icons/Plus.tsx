import Svg, { Path } from 'react-native-svg'

export function PlusIcon({ size, color }: any) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
            <Path fill={color} d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
        </Svg>
    )
}

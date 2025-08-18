import { Pressable, Text, PressableProps } from 'react-native'

type Props = {
    className?: string
    label: string
    callback: () => void
} & PressableProps

export default ({ callback, className, label, ...rest }: Props) => {
    return (
        <Pressable
            className={'text-white rounded bg-blue-500 px-7 py-3 ' + className}
            android_ripple={{ color: 'blue' }}
            onPress={callback}
            {...rest}
        >
            <Text className="text-xl font-bold text-white">{label}</Text>
        </Pressable>
    )
}

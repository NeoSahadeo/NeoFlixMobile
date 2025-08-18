import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

type Props = {
    placeholder: string
} & TextInputProps

const ThemedTextInput = ({ placeholder, ...rest }: Props) => {
    return (
        <TextInput
            style={{
                color: 'white',
                borderWidth: 1,
                borderRadius: 30,
                paddingLeft: 10,
            }}
            placeholder={placeholder}
            placeholderTextColor="#999"
            {...rest}
        />
    )
}

export default ThemedTextInput

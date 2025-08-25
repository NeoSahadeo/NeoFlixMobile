import React, { useState, useMemo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

const data = [
    { label: 'All', value: 'all' },
    { label: 'TV Shows', value: 'tv' },
    { label: 'Movies', value: 'movie' },
]

export default ({ value, setValue }: any) => {
    const [display, setDisplay] = useState(
        data.filter((e) => e['value'] === value)[0]['label']
    )

    useMemo(() => {
        const x: any = data.filter((e) => e.value == value)[0]
        if (x._index !== undefined) {
            setDisplay(x.label)
        }
    }, [value])

    const renderItem = (item: any) => {
        return (
            <View className="py-3 bg-black">
                <Text className="text-lg font-semibold px-2 text-white">
                    {item.label}
                </Text>
            </View>
        )
    }

    return (
        <Dropdown
            backgroundColor="#0000004F"
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            value={value}
            onChange={(item) => {
                setValue(item.value)
            }}
            renderLeftIcon={() => (
                <Text className="text-lg font-semibold text-white">
                    {display}
                </Text>
            )}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderRadius: 999,
        borderColor: 'white',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
        maxHeight: 40,
        minWidth: 100,
        maxWidth: 100,
    },
})

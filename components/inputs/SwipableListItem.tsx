import Animated, {
	useSharedValue,
	useAnimatedStyle,
	runOnJS,
} from 'react-native-reanimated'

import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useWindowDimensions } from 'react-native'
import Colors from '@/styles/Colors'
import React, { ReactNode } from 'react'

interface Props {
	children: ReactNode
	leftCallback: () => void
	rightCallback: () => void
	leftView: ReactNode
	rightView: ReactNode
}

export default function({
	children,
	leftCallback,
	rightCallback,
	leftView,
	rightView,
}: Props) {
	const { width } = useWindowDimensions()
	const widthOffset = width / 1.34
	const leniency = 0.05 // how much less should the user swipe for the swipe ot be registered as an official input

	const translationX = useSharedValue(0)
	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			translationX.value = event.translationX
		})
		.onEnd(() => {
			// add haptics. currently it crashes the app
			if (
				width - Math.abs(translationX.value) <
				widthOffset + widthOffset * leniency
			) {
				if (translationX.value > 0) {
					runOnJS(leftCallback)()
				} else {
					runOnJS(rightCallback)()
				}
			}
			translationX.value = 0
		})

	const animatedStyle = useAnimatedStyle(() => {
		if (width - Math.abs(translationX.value) > widthOffset) {
			return { transform: [{ translateX: translationX.value }] }
		}
		return {}
	})
	return (
		<>
			<GestureDetector gesture={panGesture}>
				<Animated.View
					style={[
						animatedStyle,
						{
							backgroundColor: Colors.backgroundPrimary,
						},
					]}
					className="flex flex-row px-2 py-4 h-16 items-center rounded-lg relative z-50 gap-3"
				>
					{children}
				</Animated.View>
			</GestureDetector>
			{leftView}
			{rightView}
		</>
	)
}

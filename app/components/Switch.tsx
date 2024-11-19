import React, { Dispatch, SetStateAction } from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Animated, {
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated'

interface SwitchProps {
	checked: boolean
	onCheckedChange: Dispatch<SetStateAction<boolean>>
	style?: StyleProp<ViewStyle>
	duration?: number
	trackColors?: { on: string; off: string }
}

const Switch = (props: SwitchProps): React.JSX.Element => {
	const {
		checked,
		onCheckedChange,
		style,
		duration = 400,
		trackColors = { on: '#82cab2', off: '#fa7f7c' }
	} = props

	const height = useSharedValue(0)
	const width = useSharedValue(0)

	const trackAnimatedStyle = useAnimatedStyle(() => {
		const color = interpolateColor(checked ? 1 : 0, [0, 1], [trackColors.off, trackColors.on])
		const colorValue = withTiming(color, { duration })

		return {
			backgroundColor: colorValue,
			borderRadius: height.value / 2
		}
	})

	const thumbAnimatedStyle = useAnimatedStyle(() => {
		const moveValue = interpolate(checked ? 1 : 0, [0, 1], [0, width.value - height.value])
		const translateValue = withTiming(moveValue, { duration })

		return {
			transform: [{ translateX: translateValue }],
			borderRadius: height.value / 2
		}
	})

	return (
		<Pressable onPress={() => onCheckedChange(!checked)}>
			<Animated.View
				onLayout={(e) => {
					height.value = e.nativeEvent.layout.height
					width.value = e.nativeEvent.layout.width
				}}
				style={[switchStyles.track, style, trackAnimatedStyle]}
			>
				<Animated.View style={[switchStyles.thumb, thumbAnimatedStyle]}></Animated.View>
			</Animated.View>
		</Pressable>
	)
}

const switchStyles = StyleSheet.create({
	track: {
		alignItems: 'flex-start',
		width: 100,
		height: 40,
		padding: 5
	},
	thumb: {
		height: '100%',
		aspectRatio: 1,
		backgroundColor: 'white'
	}
})

export default Switch

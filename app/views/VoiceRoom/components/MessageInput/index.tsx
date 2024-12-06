import { Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import { Input } from '../../../../components/ui/input'
import Icon from '../../../../components/Icon'
import React from 'react'

interface MessageInputProps {
	style?: StyleProp<ViewStyle>
	onInput?: (text: string) => void
	onEmoji?: () => void
}

const MessageInput = (props: MessageInputProps): React.JSX.Element => {
	const { style, onInput, onEmoji } = props

	const [value, setValue] = React.useState('')

	const onChangeText = (text: string) => {
		setValue(text)
	}

	return (
		<View style={styles.inputWrapper}>
			<Input
				style={styles.input}
				placeholder="Say Something..."
				placeholderTextColor={'#fff'}
				value={value}
				onChangeText={onChangeText}
				onSubmitEditing={() => {
					onInput && onInput(value)
					setValue('')
				}}
			/>
			<Pressable onPress={() => onEmoji && onEmoji()}>
				<Icon
					iconFamily="SimpleLineIcons"
					name="emotsmile"
					size={18}
					color="#fff"
					style={styles.emoji}
				/>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	inputWrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: 253,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#FFFFFF26'
	},
	emoji: {
		marginRight: 8
	},
	input: {
		marginLeft: 8,
		width: 210,
		height: 30,
		fontSize: 13,
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 0,
		borderColor: 'transparent',
		color: '#fff'
	}
})

export default MessageInput

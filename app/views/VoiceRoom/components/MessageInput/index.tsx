import { Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import { Input } from '../../../../components/ui/input'
import Icon from '../../../../components/Icon'

interface MessageInputProps {
	style?: StyleProp<ViewStyle>
	onInput?: (text: string) => void
}

const MessageInput = (props: MessageInputProps): React.JSX.Element => {
	const { style, onInput } = props

	return (
		<View style={styles.inputWrapper}>
			<Input style={styles.input} placeholder="Say Something..." placeholderTextColor={'#fff'}/>
			<Pressable onPress={() => console.log('emoji')}>
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

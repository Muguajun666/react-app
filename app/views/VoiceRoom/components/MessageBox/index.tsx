import { ScrollView, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import { TMessage } from '../../type'

interface MessageBoxProps {
	style?: StyleProp<ViewStyle>
	messageList?: TMessage[]
}

const MessageBox = (props: MessageBoxProps): React.JSX.Element => {
	const { style, messageList = [] } = props

	const renderMessageItem = (message: TMessage, index: number) => {
		const { content, type, id, userName, avatar } = message

		return (
			<View key={id} style={{ marginTop: index === 0 ? 0 : 7 }}>
				<Text style={[styles.textWrapper, type === 'system' && styles.systemMessage, type === 'user' && styles.userMessage]}>{content}</Text>
			</View>
		)
	}

	return (
		<ScrollView style={[style, { gap: 100 }]}>
			{messageList.map((item, index) => renderMessageItem(item, index))}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	textWrapper: {
		padding: 6,
		backgroundColor: '#00000033',
		alignSelf: 'flex-start',
		borderRadius: 9
	},
  systemMessage: {
    fontSize: 11,
    color: '#69EFFFFF'
  },
  userMessage: {
    fontSize: 13,
    color: '#FFFFFFFF'
  }
})

export default MessageBox

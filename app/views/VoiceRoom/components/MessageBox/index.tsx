import { FlatList, ScrollView, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import { TMessage } from '../../type'
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar'
import { IMG_BASE_URL } from '@env'

interface MessageBoxProps {
	style?: StyleProp<ViewStyle>
	messageList?: TMessage[]
}

const MessageBox = (props: MessageBoxProps): React.JSX.Element => {
	const { style, messageList = [] } = props

	const renderMessageItem = (message: TMessage, index: number) => {
		const { content, type, id, userName, avatar } = message

		let renderItem: React.JSX.Element | null = null

		if (type === 'system') {
			renderItem = <Text style={[styles.textWrapper, styles.systemMessage]} key={id}>{content}</Text>
		} else if (type === 'user') {
			renderItem = (
				<View style={[styles.userMessageWrapper, styles.textWrapper]} key={id}>
					<Avatar alt="Avatar" style={styles.avatar}>
						<AvatarImage
							source={
								avatar
									? { uri: `${IMG_BASE_URL}${avatar}` }
									: require('../../../../assets/images/avatar.png')
							}
						/>
					</Avatar>
					<Text style={[styles.userMessage]}>{userName}: {content}</Text>
				</View>
			)
		}

		return (
			<View key={id} style={{ marginTop: index === 0 ? 0 : 7 }}>
				{renderItem}
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
		color: '#FFFFFFFF',
		lineHeight: 18,
    maxWidth: 230
	},
	userMessageWrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: 23,
		height: 23,
		borderWidth: 1,
		borderColor: '#FFFFFF',
    marginRight: 6
	}
})

export default MessageBox

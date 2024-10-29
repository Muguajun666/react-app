import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { SeatInfo, UserInfo } from '../../type'
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar'
import { IMG_BASE_URL } from '@env'
import Icon from '../../../../components/Icon'

interface SeatProps extends SeatInfo {
	isMaster?: boolean
	style?: StyleProp<ViewStyle>
	onPress?: () => void
}

const Seat = (props: SeatProps): React.JSX.Element => {
	const { isMaster, style, userInfo, seatNumber, isUsed, isLocked, isMuted, onPress } =
		props

	return (
		<Pressable onPress={onPress} style={style}>
			{isMaster ? (
				<View>
					<Avatar alt="Avatar" style={[styles.seatSize, isUsed && styles.masterBorder]}>
						<>
							{isUsed ? (
								<AvatarImage
									source={
										userInfo?.avatar
											? { uri: `${IMG_BASE_URL}${userInfo?.avatar}` }
											: require('../../../../assets/images/avatar.png')
									}
								/>
							) : (
								<AvatarFallback style={styles.userLeave}>
									<Text style={{ color: '#fff' }}>Master Absent</Text>
								</AvatarFallback>
							)}
						</>
					</Avatar>
					<Text style={styles.userText}>{userInfo ? userInfo.userName : 'Master'}</Text>
					{isUsed && (
						<View style={styles.microphone}>
							<Image style={{ width: 14, height: 14}} source={isMuted ? require('../../../../assets/images/microphone-slash.png') : require('../../../../assets/images/microphone.png')} />
						</View>
					)}
				</View>
			) : (
				<View>
					<Avatar alt="Avatar" style={[styles.seatSize, isUsed && styles.otherBorder]}>
						<>
							{isUsed ? (
								<AvatarImage
									source={
										userInfo?.avatar
											? { uri: `${IMG_BASE_URL}${userInfo?.avatar}` }
											: require('../../../../assets/images/avatar.png')
									}
								/>
							) : (
								<AvatarFallback style={styles.userLeave}>
									{isLocked ? (
										<Icon iconFamily="Fontisto" name="locked" size={18} color="#fff" />
									) : (
										<Icon iconFamily="FontAwesome5" name="plus" size={18} color="#fff" />
									)}
								</AvatarFallback>
							)}
						</>
					</Avatar>
					<Text style={styles.userText}>{`No.${seatNumber}`}</Text>
          {isUsed && (
						<View style={styles.microphone}>
							<Image style={{ width: 14, height: 14}} source={isMuted ? require('../../../../assets/images/microphone-slash.png') : require('../../../../assets/images/microphone.png')} />
						</View>
					)}
        </View>
			)}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	seatSize: {
		width: 64,
		height: 64
	},
	masterBorder: {
		borderWidth: 2,
		borderColor: '#FF4BF2FF'
	},
	otherBorder: {
		borderWidth: 2,
		borderColor: '#AA4EFFFF'
	},
	userText: {
		fontSize: 12,
		color: '#fff',
		textAlign: 'center',
		marginTop: 4,
		fontWeight: 400
	},
	userLeave: {
		backgroundColor: 'rgba(255, 255, 255, 0.3)'
	},
	microphone: {
		position: 'absolute',
		bottom: 20,
		right: 2,
	}
})

export default Seat

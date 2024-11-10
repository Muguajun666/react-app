import { useEffect, useRef, useState } from 'react'
import { TRoomListItem } from '../../services/type'
import {
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
	NativeModules,
	DeviceEventEmitter,
	ActivityIndicator
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { BlurView } from '@react-native-community/blur'
import { IMG_BASE_URL } from '@env'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '../../components/ui/avatar'
import Navigation from '../../navigation/appNavigation'
import { MIC_HANDLE_TYPE, SeatInfo, TGameInfo, TMessage } from './type'
import Seat from './components/Seat'
import Icon from '../../components/Icon'
import MessageBox from './components/MessageBox'
import GameSwiper from './components/GameSwiper'
import MessageInput from './components/MessageInput'
import { initialSeats } from './config'
import { LISTENER } from '../../components/Toast'
import EventEmitter from '../../utils/emitter'
import BottomSheet from '@gorhom/bottom-sheet'
import UserToSelfSheet from './components/BottomSheet/UserToSelfSheet'
import UserToUsedSeatSheet from './components/BottomSheet/UserToUsedSeatSheet'

export type VoiceRoomParams = {
	key: string
	name: string
	params: TRoomListItem
}

const VoiceRoom = (): React.JSX.Element => {
	const { VoiceRoomModule } = NativeModules

	const userInfo = useSelector((state: any) => state.user.userInfo)

	const token = useSelector((state: any) => state.app.token)

	const messageBoxRef = useRef<ScrollView>(null)

	const userToSelfSheetRef = useRef<BottomSheet>(null)
	const userToUsedSeatSheetRef = useRef<BottomSheet>(null)

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false)

	const { params } = useRoute<VoiceRoomParams>()

	const { coverImg, subject: roomName, aliRoomId: roomId, heatValue } = params

	const [isOnSeat, setIsOnSeat] = useState<boolean>(false)

	const [isOnMic, setIsOnMic] = useState<boolean>(false)

	const [audienceCount, setAudienceCount] = useState<number>(0)

	const [seats, setSeats] = useState<Array<SeatInfo>>(initialSeats)

	const [messageList, setMessageList] = useState<Array<TMessage>>([])

	const [gameList, setGameList] = useState<Array<TGameInfo>>([
		{
			name: 'GameA'
		},
		{
			name: 'GameB'
		}
	])

	const [isJoin, setIsJoin] = useState<boolean>(false)

	useEffect(() => {
		joinRoomHandle()

		return () => {
			DeviceEventEmitter.removeAllListeners('onJoin')
			DeviceEventEmitter.removeAllListeners('onJoinedRoom')
			DeviceEventEmitter.removeAllListeners('onLeave')
			DeviceEventEmitter.removeAllListeners('onLeavedRoom')
			DeviceEventEmitter.removeAllListeners('onJoinedMic')
			DeviceEventEmitter.removeAllListeners('onLeavedMic')
			DeviceEventEmitter.removeAllListeners('onRoomMicListChanged')
			DeviceEventEmitter.removeAllListeners('onReceivedTextMessage')
			DeviceEventEmitter.removeAllListeners('onMemberCountChanged')
			console.log('组件卸载', seats)
		}
	}, [])

	const joinRoomHandle = async () => {
		console.log('joinRoomHandle')

		DeviceEventEmitter.addListener('onJoin', async (data: any) => {
			console.log('onJoin', data)
			// 设置鉴权信息
			await VoiceRoomModule.setAuthorizeToken(token)
			// 获取麦位信息
			await VoiceRoomModule.getMicInfoList(roomId)
		})
		DeviceEventEmitter.addListener('onJoinedRoom', (data: string) => {
			console.log('onJoinedRoom', data)
			const user = JSON.parse(data)
			// 添加消息
			setMessageList((prev) => {
				prev.push({
					id: Date.now() + '',
					type: 'system',
					content: `${user.userName} 进入房间`
				})
				return [...prev]
			})
			messageBoxRef.current?.scrollToEnd()
		})
		DeviceEventEmitter.addListener('onLeave', (data: any) => {
			console.log('onLeave', data)
			// setSeats(initialSeats)
		})
		DeviceEventEmitter.addListener('onLeavedRoom', (data: string) => {
			console.log('onLeavedRoom', data)
			const user = JSON.parse(data)
			// 添加消息
			setMessageList((prev) => {
				prev.push({
					id: Date.now() + '',
					type: 'system',
					content: `${user.userName} 离开房间`
				})
				return [...prev]
			})
			messageBoxRef.current?.scrollToEnd()
		})
		DeviceEventEmitter.addListener('onJoinedMic', (data: string) => {
			// 有人上麦
			const micUser = JSON.parse(data)
			console.log('onJoinedMic', data)
			updateSeats(micUser, MIC_HANDLE_TYPE.JOIN)
		})
		DeviceEventEmitter.addListener('onLeavedMic', (data: string) => {
			// 有人下麦
			const micUser = JSON.parse(data)
			console.log('onLeavedMic', data)
			updateSeats(micUser, MIC_HANDLE_TYPE.LEAVE)
		})
		DeviceEventEmitter.addListener('onRoomMicListChanged', async (data: string) => {
			// 获取房间麦位信息列表
			const micUserList = JSON.parse(data)
			console.log('onRoomMicListChanged', micUserList)
			updateSeats(micUserList)
			// 判断自己是否在麦位上
			const micUser = micUserList.find((item: any) => item.userId === userInfo.id)
			if (micUser) {
				// 直接上麦
				await VoiceRoomModule.joinMicDirect(roomId, micUser.micPosition)
			}
		})
		DeviceEventEmitter.addListener('onReceivedTextMessage', (data: any) => {
			const { jsonUserInfo, text } = data
			const userInfo = JSON.parse(jsonUserInfo)
			console.log('onReceivedTextMessage', data)
			// 添加消息
			setMessageList((prev) => {
				prev.push({
					id: Date.now() + '',
					type: 'user',
					content: text,
					userName: userInfo.userName,
					avatar: userInfo.avatarUrl === 'null' ? null : userInfo.avatarUrl
				})
				return [...prev]
			})
			messageBoxRef.current?.scrollToEnd()
		})
		DeviceEventEmitter.addListener('onMemberCountChanged', (count: number) => {
			setAudienceCount(count)
		})
		const joinRoomRes = await VoiceRoomModule.joinRoom(roomId)
		const { result, msg } = joinRoomRes
		console.log('joinRoomRes', result, msg)
		if (result) {
			setIsJoin(true)
		} else {
			Navigation.back()
		}
	}

	const updateSeats = (micUsers: Array<any> | any, type?: MIC_HANDLE_TYPE) => {
		if (Array.isArray(micUsers)) {
			if (micUsers.length === 0) return
			const newSeats = seats.map((item: SeatInfo) => {
				const micUser = micUsers.find((user: any) => user.micPosition === item.seatNumber)
				if (micUser) {
					const { avatarUrl, isMute, userId, userName } = micUser
					return {
						...item,
						isUsed: true,
						isMuted: isMute,
						userInfo: {
							avatar: avatarUrl === 'null' ? null : avatarUrl,
							userId,
							userName
						}
					}
				} else {
					return {
						...item,
						isUsed: false,
						isMuted: false,
						userInfo: undefined
					}
				}
			})
			console.log('初始化麦位信息: ', newSeats)
			setSeats([...newSeats])
		} else {
			const { micPosition, avatarUrl, isMute, userId, userName } = micUsers
			const isCurrentUser = userId === userInfo.id
			if (type === MIC_HANDLE_TYPE.JOIN) {
				setSeats((prev) => {
					const newSeats = [...prev]

					newSeats[micPosition] = {
						...newSeats[micPosition],
						isUsed: true,
						isMuted: isMute,
						userInfo: {
							avatar: avatarUrl === 'null' ? null : avatarUrl,
							userId,
							userName
						}
					}
					return newSeats
				})
				if (isCurrentUser) {
					setIsOnSeat(true)
					EventEmitter.emit(LISTENER, { message: '上麦成功' })
				}
			} else if (type === MIC_HANDLE_TYPE.LEAVE) {
				setSeats((prev) => {
					const newSeats = [...prev]

					newSeats[micPosition] = {
						...newSeats[micPosition],
						isUsed: false,
						isMuted: false,
						userInfo: undefined
					}

					return newSeats
				})
				if (isCurrentUser) {
					setIsOnSeat(false)
					EventEmitter.emit(LISTENER, { message: '下麦成功' })
				}
			}
		}
	}

	const backHandle = async () => {
		// 离开房间
		const leaveRoomRes = await VoiceRoomModule.leaveRoom(roomId)

		if (leaveRoomRes) {
			Navigation.back()
		}
	}

	const sendMessageHandle = async (message: string) => {
		if (message) {
			await VoiceRoomModule.sendMessage(roomId, message)
		}
	}

	const masterSeatHandle = () => {}

	const onBottomSheetOpen = () => {
		setIsBottomSheetOpen(true)
	}

	const onBottomSheetClose = () => {
		setIsBottomSheetOpen(false)
	}

	const standupHandle = async () => {
		// 自己的麦位 下麦
		await VoiceRoomModule.leaveMic(roomId)
		userToSelfSheetRef.current?.close()
	}

	const otherSeatHandle = async (pos: number) => {
		console.log('otherSeatHandle', pos)
		// 以下为非房主逻辑
		if (isOnSeat) {
			if (seats[pos].userInfo?.userId === userInfo.id) {
				if (!isBottomSheetOpen) {
					userToSelfSheetRef.current?.expand()
				}
			} else {
				if (seats[pos].isUsed) {
					if (!isBottomSheetOpen) {
						userToUsedSeatSheetRef.current?.expand()
					}
				} else {
					EventEmitter.emit(LISTENER, { message: '已在麦位上' })
				}
			}
		} else {
			if (seats[pos].isUsed) {
				if (!isBottomSheetOpen) {
					userToUsedSeatSheetRef.current?.expand()
				}
			} else {
				await VoiceRoomModule.joinMic(roomId, {
					micIndex: pos,
					microphoneSwitch: true
				})
			}
		}
	}

	const renderHeaderAvatar = () => {}

	const microphoneHandle = () => {
		if (!isOnSeat) return
		if (isOnMic) {
			console.log('下麦')
			// todo 下麦操作
			setIsOnMic(false)
		} else {
			console.log('上麦')
			// todo 上麦操作
			setIsOnMic(true)
		}
	}

	return (
		<>
			{isJoin ? (
				<View className="w-full h-full items-center">
					<Image source={{ uri: `${IMG_BASE_URL}${coverImg}` }} style={styles.absolute} />
					<BlurView style={styles.absolute} blurType="dark" blurAmount={10} />
					{/* header */}
					<View className="w-full flex flex-row items-center justify-between pt-1 pb-1">
						{/* header-left */}
						<View key={'header-left'} className="flex flex-row items-center">
							<Pressable onPress={backHandle}>
								<Icon
									iconFamily="AntDesign"
									name="left"
									size={15}
									color="#fff"
									style={{ marginLeft: 12, marginRight: 6 }}
								/>
							</Pressable>
							<Avatar alt="Avatar" className="w-9 h-9">
								{coverImg ? (
									<AvatarImage source={{ uri: `${IMG_BASE_URL}${coverImg}` }} />
								) : (
									<AvatarImage source={require('../../assets/images/avatar.png')} />
								)}
							</Avatar>
							<View key={'room-info'} className="flex flex-col ml-1">
								<View className="flex flex-row items-center">
									<Text style={styles.roomName}>{roomName}</Text>
									<Icon
										iconFamily="Entypo"
										name="lock-open"
										size={13}
										color="#fff"
										style={{ marginLeft: 3 }}
									/>
								</View>
								<Text style={styles.roomId}>ID:{roomId}</Text>
							</View>
						</View>
						{/* header-right */}
						<View key={'header-right'} className="flex flex-row items-center">
							<View className="flex flex-row items-center relative w-20 h-8">
								<View
									className="absolute right-0 flex flex-row items-center justify-center rounded-full mr-2"
									style={{ width: 25, height: 25, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
								>
									<Text style={{ color: '#fff' }}>{audienceCount}</Text>
								</View>
							</View>
							<Pressable>
								<Icon
									iconFamily="Ionicons"
									name="settings-outline"
									size={19}
									color="#fff"
									style={{ marginRight: 13 }}
								/>
							</Pressable>
						</View>
					</View>
					{/* fire */}
					<View className="w-full mt-1" style={{ height: 17 }}>
						<View
							style={{
								width: 55,
								height: 17,
								backgroundColor: 'rgba(255, 255, 255, 0.3)',
								borderRadius: 8,
								marginLeft: 12
							}}
							className="flex flex-row items-center justify-center"
						>
							<Image
								source={require('../../assets/images/fire.png')}
								style={{ width: 8, height: 10, marginRight: 4 }}
							/>
							<Text style={{ fontSize: 12, color: '#fff' }}>{heatValue}</Text>
						</View>
					</View>
					{/* master-avatar */}
					<View
						className="w-full flex flex-row items-center justify-center"
						style={{ marginTop: 15 }}
					>
						<Seat
							isMaster={true}
							uid={userInfo.id}
							userInfo={seats[0].userInfo}
							isLocked={seats[0].isLocked}
							isMuted={seats[0].isMuted}
							isUsed={seats[0].isUsed}
							onPress={() => masterSeatHandle}
						/>
					</View>
					{/* other-avatar */}
					<View
						className="w-full flex flex-row items-center justify-center flex-wrap"
						style={{ marginTop: 18, height: 200 }}
					>
						{seats.slice(1).map((item) => {
							return (
								<Seat
									style={{ flexBasis: '25%', flexShrink: 0, alignItems: 'center', marginTop: 6 }}
									seatNumber={item.seatNumber}
									key={item.seatNumber}
									userInfo={item.userInfo}
									isLocked={item.isLocked}
									isMaster={false}
									isMuted={item.isMuted}
									isUsed={item.isUsed}
									uid={userInfo.id}
									onPress={() => otherSeatHandle(item.seatNumber!)}
								/>
							)
						})}
					</View>
					{/* message-box && game-swiper */}
					<View
						className="w-full flex flex-row justify-center"
						style={{ paddingLeft: 15, paddingRight: 15, marginTop: -5 }}
					>
						{/* message-box */}
						<MessageBox
							ref={messageBoxRef}
							style={{
								maxHeight: 280
							}}
							messageList={messageList}
						/>
						{/* swiper */}
						<View className="relative" style={{ width: 70, height: 280 }}>
							<GameSwiper swiperData={gameList} />
						</View>
					</View>
					{/* message-input && microphone-handler */}
					<View
						className="w-full flex flex-row items-center"
						style={{ marginLeft: 30, marginTop: 10 }}
					>
						<MessageInput onInput={sendMessageHandle} />
						{isOnSeat && (
							<Pressable onPress={microphoneHandle} style={{ marginLeft: 50 }}>
								<Image
									source={
										isOnMic
											? require('../../assets/images/mic-off.png')
											: require('../../assets/images/mic-on.png')
									}
									style={{ width: 30, height: 30 }}
								/>
							</Pressable>
						)}
					</View>
					{/* bottom-sheets */}
					<UserToSelfSheet
						ref={userToSelfSheetRef}
						onClose={onBottomSheetClose}
						onOpen={onBottomSheetOpen}
						onStandup={standupHandle}
						closeHandle={() => userToSelfSheetRef.current?.close()}
					/>
					<UserToUsedSeatSheet
						ref={userToUsedSeatSheetRef}
						onClose={onBottomSheetClose}
						onOpen={onBottomSheetOpen}
						userHandle={() => console.log('Add friends/Send message')}
						checkRelationship={() => console.log('Check relationship')}
						closeHandle={() => userToUsedSeatSheetRef.current?.close()}
					/>
				</View>
			) : (
				<ActivityIndicator size="large" animating={!isJoin} className="mt-12" />
			)}
		</>
	)
}

const styles = StyleSheet.create({
	absolute: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	roomName: {
		color: '#fff',
		fontSize: 13
	},
	roomId: {
		color: '#fff',
		fontSize: 10
	},
	contentContainer: {
		flex: 1,
		padding: 36,
		alignItems: 'center'
	}
})

export default VoiceRoom

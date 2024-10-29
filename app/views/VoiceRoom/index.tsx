import { PropsWithChildren, forwardRef, useState } from 'react'
import { TRoomListItem } from '../../services/type'
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { BlurView } from '@react-native-community/blur'
import { IMG_BASE_URL } from '@env'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import Navigation from '../../navigation/appNavigation'
import { SeatInfo, TGameInfo, TMessage } from './type'
import Seat from './components/Seat'
import Icon from '../../components/Icon'
import MessageBox from './components/MessageBox'
import GameSwiper from './components/GameSwiper'

export type VoiceRoomParams = {
	key: string
	name: string
	params: TRoomListItem
}

const backHandle = () => {
	Navigation.back()
}

const VoiceRoom = (): React.JSX.Element => {
	const userInfo = useSelector((state: any) => state.user.userInfo)

	const { params } = useRoute<VoiceRoomParams>()
	const { coverImg, subject: roomName, aliRoomId: roomId, heatValue } = params

	const [audiences, setAudiences] = useState<Array<any>>([])

	const [seats, setSeats] = useState<Array<SeatInfo>>()

	const [messageList, setMessageList] = useState<Array<TMessage>>([
		{
			id: '1',
			type: 'system',
			content: 'Hello World'
		},
		{
			id: '2',
			type: 'system',
			content: 'Hello World 2'
		},
		{
			id: '3',
			type: 'user',
			userName: 'userA',
			content: 'Hello World Hello World Hello World Hello World Hello World'
		}
	])

	const [gameList, setGameList] = useState<Array<TGameInfo>>([
		{
			name: 'GameA'
		},
		{
			name: 'GameB'
		}
	])

	const renderHeaderAvatar = () => {
		return audiences.map((item, index) => {})
	}

	return (
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
							<Text style={{ color: '#fff' }}>{audiences.length}</Text>
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
			<View className="w-full flex flex-row items-center justify-center" style={{ marginTop: 15 }}>
				<Seat isMaster={true} />
			</View>
			{/* other-avatar */}
			<View
				className="w-full flex flex-row items-center justify-center flex-wrap"
				style={{ marginTop: 18, height: 200 }}
			>
				{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
					return (
						<Seat
							style={{ flexBasis: '25%', flexShrink: 0, alignItems: 'center', marginTop: 6 }}
							seatNumber={item}
							key={item}
						/>
					)
				})}
			</View>
			{/* message-box && game-swiper */}
			<View
				className="w-full flex flex-row justify-center"
				style={{ paddingLeft: 15, paddingRight: 15 }}
			>
				{/* message-box */}
				<MessageBox
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
		</View>
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
	}
})

export default VoiceRoom

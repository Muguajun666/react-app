import { PropsWithChildren, forwardRef, useState } from 'react'
import { TRoomListItem } from '../../services/type'
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { BlurView } from '@react-native-community/blur'
import { IMG_BASE_URL } from '@env'
import { useSelector } from 'react-redux'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import Navigation from '../../navigation/appNavigation'

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
	const { coverImg, subject: roomName, aliRoomId: roomId } = params

	const [audiences, setAudiences] = useState<Array<any>>([
		{
			id: 1
		},
		{
			id: 2
		},
		{
			id: 3
		},
		{
			id: 4
		}
	])

	const renderHeaderAvatar = () => {
		return audiences.map((item) => {
			
		})
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
						<AntDesignIcon
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
							<EntypoIcon name="lock-open" size={13} color="#fff" style={{ marginLeft: 3 }} />
						</View>
						<Text style={styles.roomId}>ID:{roomId}</Text>
					</View>
				</View>
				{/* header-right */}
				<View key={'header-right'} className="flex flex-row items-center">
					<View className="flex flex-row items-center"></View>
					<Pressable>
						<IoniconsIcon
							name="settings-outline"
							size={19}
							color="#fff"
							style={{ marginRight: 13 }}
						/>
					</Pressable>
				</View>
			</View>
			{/* fire */}
			<View className="bg-blue-500 w-full h-20"></View>
			{/* master-avatar */}
			<View className="bg-green-500 w-full h-20"></View>
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

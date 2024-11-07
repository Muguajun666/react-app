import React, { useEffect, useState } from 'react'
import { loginApi, getUserInfoApi } from '../../services/api/user'
import {
	getImTokenApi,
	getRoomListApi,
	getRtcTokenApi,
	joinRoomApi
} from '../../services/api/voice'
import { useDispatch, useSelector } from 'react-redux'
import { IResponse, ImTokenObject, RtcTokenObject, TRoomListItem } from '../../services/type'
import { setToken, clearToken } from '../../store/reducers/app'
import { IMG_BASE_URL } from '@env'
import Navigation from '../../navigation/appNavigation'
import {
	Pressable,
	ActivityIndicator,
	Button,
	FlatList,
	Image,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	View,
	StyleSheet,
	NativeModules
} from 'react-native'
import { setUser } from '../../store/reducers/user'

const Test = (): React.JSX.Element => {
	const { VoiceRoomModule } = NativeModules

	const token = useSelector((state: any) => state.app.token)
	const userInfo = useSelector((state: any) => state.user.userInfo)
	const dispatch = useDispatch()

	const [voiceRoomList, setVoiceRoomList] = useState<Array<TRoomListItem>>([])

	const [showRoom, setShowRoom] = useState(false)

	const [isLoading, setIsLoading] = useState(true)

	const [currentRoom, setCurrentRoom] = useState<TRoomListItem>({})

	const loginHandle = async () => {
		// const res = (await loginApi({ loginType: 'TEMP', phoneMac: 'd2b82b944510dc0c' })) as IResponse<any>
		const res = (await loginApi({ loginType: 'TEMP', phoneMac: '000000' })) as IResponse<any>
		if (res.success) {
			dispatch(setToken({ token: res.object }))
			getUserInfo()
		}
	}

	const clearTokenHandle = () => {
		dispatch(clearToken())
	}

	const createVoiceRoom = () => {
		console.log('创建房间')
		VoiceRoomModule.createVoiceRoom()
	}

	const getUserInfo = async () => {
		const res = (await getUserInfoApi()) as IResponse<any>
		if (res.success) {
			dispatch(setUser({ userInfo: res.object }))
		}
	}

	const getVoiceRooms = async () => {
		console.log('获取房间')
		setIsLoading(true)
		const res = (await getRoomListApi({ pageNum: 1, pageSize: 10 })) as IResponse<any>
		if (res.success) {
			setVoiceRoomList(res.object.list)
			setIsLoading(false)
			console.log('房间列表: ', res.object.list)
		}
	}

	const creatRoomHandle = async (room: TRoomListItem) => {
		console.log('加入房间', room)

		const joinRoomRes = (await joinRoomApi({ id: room.id! })) as IResponse<any>
		console.log('joinRoomRes', joinRoomRes)
		if (!joinRoomRes.success) return

		const rtctokenRes = (await getRtcTokenApi({
			roomId: room.aliRoomId!
		})) as IResponse<RtcTokenObject>
		console.log('rtctokenRes', rtctokenRes)
		if (!rtctokenRes.success) return

		const imTokenRes = (await getImTokenApi()) as IResponse<ImTokenObject>
		console.log('imTokenRes', imTokenRes)
		if (!imTokenRes.success) return

		const creatRoomRes = await VoiceRoomModule.createVoiceRoom(
			userInfo,
			imTokenRes.object,
			rtctokenRes.object,
			room
		)

		const { result, msg } = creatRoomRes
		console.log('creatRoomRes', result, msg)
		if (result) {
			Navigation.navigate('VoiceRoom', room)
		}
	}

	const tokenCheckHandle = () => {
		console.log('Token检查: ', token)
		return !!token
	}

	useEffect(() => {
		const hasToken = tokenCheckHandle()
		if (!hasToken) {
			loginHandle()
		} else {
			getUserInfo()
		}
	}, [])

	useEffect(() => {
		if (token) {
			getVoiceRooms()
		}
	}, [token])

	const roomRenderItem = ({ item }: { item: TRoomListItem }) => {
		return (
			<Pressable
				className="bg-green-100 mt-2 h-20 flex flex-row justify-around items-center"
				onPress={() => {
					creatRoomHandle(item)
				}}
			>
				<Image
					className="h-full aspect-square mr-2"
					source={{ uri: `${IMG_BASE_URL}${item.coverImg}` }}
				/>
				<View>
					<Text style={styles.text}>aliRoomId: {item.aliRoomId}</Text>
					<Text style={styles.text}>createUser: {item.createUser}</Text>
					<Text style={styles.text}>onlineAmount: {item.onlineAmount}</Text>
				</View>
			</Pressable>
		)
	}

	return (
		<SafeAreaView>
			<StatusBar className="bg-white" barStyle={'dark-content'} />
			<ScrollView contentInsetAdjustmentBehavior="automatic">
				<View className="flex flex-col">
					<View className="bg-green-100 h-30 items-center p-1">
						<Text style={styles.text}>Token: {token}</Text>
					</View>
					<View className="bg-green-100 h-30 items-center mt-2">
						<Text style={styles.text}>UserInfo: {JSON.stringify(userInfo)}</Text>
					</View>
					<View className="h-10 mt-2 flex flex-row justify-around items-center">
						<Button title="获取房间" onPress={getVoiceRooms}></Button>
						<Button title="获取用户信息" onPress={getUserInfo}></Button>
						{/* <Button title="创建房间" onPress={createVoiceRoom}></Button> */}
						<Button title="清除Token" onPress={clearTokenHandle}></Button>
					</View>
				</View>
			</ScrollView>
			<View>
				{isLoading && <ActivityIndicator size="large" animating={isLoading} className="mt-12" />}
				{!isLoading && (
					<FlatList
						data={voiceRoomList}
						renderItem={roomRenderItem}
						keyExtractor={(item) => item.id!.toString()}
					/>
				)}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	text: {
		fontSize: 10
	}
})

export default Test

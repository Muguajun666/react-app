/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import {
	ActivityIndicator,
	Button,
	FlatList,
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View
} from 'react-native'

import Modal from 'react-native-modal'

import { loginApi } from './services/api/user'
import { getRoomListApi } from './services/api/voice'
import { useDispatch, useSelector } from 'react-redux'
import { IResponse, TRoomListItem } from './services/type'
import { setToken } from './store/reducers/app'
import { IMG_BASE_URL } from '@env'
import VoiceRoom from './views/VoiceRoom'

const AppContainer = (): React.JSX.Element => {
	const token = useSelector((state: any) => state.app.token)
	const dispatch = useDispatch()

	const [voiceRoomList, setVoiceRoomList] = useState<Array<TRoomListItem>>([])

	const [showRoom, setShowRoom] = useState(false)

	const [isLoading, setIsLoading] = useState(true)

	const [currentRoom, setCurrentRoom] = useState<TRoomListItem>({})

	const loginHandle = async () => {
		const res = (await loginApi({ loginType: 'TEMP', phoneMac: '123456' })) as IResponse
		if (res.success) {
			dispatch(setToken({ token: res.object }))
		}
	}

	const createVoiceRoom = () => {
		console.log('创建房间')
	}

	const getVoiceRooms = async () => {
		console.log('获取房间')
		setIsLoading(true)
		const res = (await getRoomListApi({ pageNum: 1, pageSize: 10 })) as IResponse
		if (res.success) {
			setVoiceRoomList(res.object.list)
			setIsLoading(false)
			console.log('房间列表: ', res.object.list)
		}
	}

	const joinRoomHandle = async (room: TRoomListItem) => {
		console.log('加入房间', room)
		setShowRoom(true)
		setCurrentRoom(room)
	}

	const tokenCheckHandle = () => {
		console.log('Token检查: ', token)
		return !!token
	}

	useEffect(() => {
		const hasToken = tokenCheckHandle()
		if (!hasToken) {
			loginHandle()
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
					joinRoomHandle(item)
				}}
			>
				<Image
					className="h-full aspect-square mr-2"
					source={{ uri: `${IMG_BASE_URL}${item.coverImg}` }}
				/>
				<View>
					<Text>aliRoomId: {item.aliRoomId}</Text>
					<Text>createUser: {item.createUser}</Text>
					<Text>onlineAmount: {item.onlineAmount}</Text>
				</View>
			</Pressable>
		)
	}

	return (
		<SafeAreaView>
			<StatusBar className="bg-white" barStyle={'dark-content'} />
			<ScrollView contentInsetAdjustmentBehavior="automatic">
				<View className="flex flex-col">
					<View className="bg-green-100 h-30 items-center">
						<Text>Token: {token}</Text>
					</View>
					<View className="h-20 mt-2 flex flex-row justify-around items-center">
						<Button title="获取房间" onPress={getVoiceRooms}></Button>
						<Button title="创建房间" onPress={createVoiceRoom}></Button>
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
			<Modal isVisible={showRoom} style={{ margin: 0 }}>
				<VoiceRoom
					roomInfo={currentRoom}
					onExit={() => {
						console.log('退出房间')
						setShowRoom(false)
					}}
				/>
			</Modal>
		</SafeAreaView>
	)
}

export default AppContainer

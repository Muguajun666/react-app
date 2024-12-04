/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TestScreen from './views/Test'
import VoiceRoomScreen from './views/VoiceRoom'
import PartySetterScreen from './views/PartySetter'
import AddressScreen from './views/Address'
import OrderScreen from './views/Order'
import Navigation from './navigation/appNavigation'
// import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { NativeModules } from 'react-native'
import Loading from './components/Loading'
import { useDispatch } from 'react-redux'
import { setToken } from './store/reducers/app'
import { setUser } from './store/reducers/user'
import { IResponse, ImTokenObject, RtcTokenObject, TRoomListItem } from './services/type'
import { getImTokenApi, getRtcTokenApi } from './services/api/voice'

const Stack = createNativeStackNavigator()

function HomeScreen() {
	const { VoiceRoomModule, RNNavigationModule } = NativeModules

	const userInfo = useRef<any>({})

	const dispatch = useDispatch()

	useEffect(() => {
		initNavigation()
	}, [])

	const initNavigation = async () => {
		const res = await RNNavigationModule.getInitialNavigationParams()
		console.log('initNavigation', res)
		const { screen, jsonParams } = res
		if (!screen || (screen === 'Home' && jsonParams === 'preload')) {
			RNNavigationModule.backToAndroid()
		} else {
			const token = await RNNavigationModule.getParamsByTag('token')
			dispatch(setToken({ token }))

			const jsonUserInfo = await RNNavigationModule.getParamsByTag('userInfo')
			userInfo.current = JSON.parse(jsonUserInfo)
			dispatch(setUser({ userInfo: userInfo.current }))

			console.log('token', token)
			console.log('userInfo', jsonUserInfo)

			// 进入语音房
			if (screen === 'VoiceRoom') {
				creatRoomHandle(JSON.parse(jsonParams))
			} else {
				Navigation.replace(screen, jsonParams)
			}
		}
	}

	const creatRoomHandle = async (room: TRoomListItem) => {
		console.log('加入房间', room)

		// const joinRoomRes = (await joinRoomApi({ id: room.id! })) as IResponse<any>
		// console.log('joinRoomRes', joinRoomRes)
		// if (!joinRoomRes.success) return

		const rtctokenRes = (await getRtcTokenApi({
			roomId: room.aliRoomId!
		})) as IResponse<RtcTokenObject>
		console.log('rtctokenRes', rtctokenRes)
		if (!rtctokenRes.success) return

		const imTokenRes = (await getImTokenApi()) as IResponse<ImTokenObject>
		console.log('imTokenRes', imTokenRes)
		if (!imTokenRes.success) return

		const creatRoomRes = await VoiceRoomModule.createVoiceRoom(
			userInfo.current,
			imTokenRes.object,
			rtctokenRes.object,
			room
		)

		const { result, msg } = creatRoomRes
		console.log('creatRoomRes', result, msg)
		if (result) {
			Navigation.replace('VoiceRoom', room)
		} else {
			RNNavigationModule.backToAndroid()
		}
	}

	return (
		// <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		// 	<Text>Home Screen</Text>
		// 	<View className="mt-4">
		// 		<Button
		// 			title="跳转至测试页"
		// 			onPress={() => {
		// 				Navigation.navigate('Test')
		// 			}}
		// 		></Button>
		// 	</View>
		// </View>
		<Loading />
	)
}

const AppContainer = (): React.JSX.Element => {
	return (
		<NavigationContainer ref={Navigation.navigationRef}>
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={{ headerShown: true, animation: 'none' }}
			>
				<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Test" component={TestScreen} />
				<Stack.Screen
					name="VoiceRoom"
					component={VoiceRoomScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="PartySetter"
					component={PartySetterScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="Address" component={AddressScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppContainer

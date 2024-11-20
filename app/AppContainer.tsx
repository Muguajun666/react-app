/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TestScreen from './views/Test'
import VoiceRoomScreen from './views/VoiceRoom'
import PartySetterScreen from './views/PartySetter'
import { Button, Text, View } from 'react-native'
import Navigation from './navigation/appNavigation'
// import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { NativeModules } from 'react-native'
import Loading from './components/Loading'

const Stack = createNativeStackNavigator()

function HomeScreen() {
	const { VoiceRoomModule, RNNavigationModule } = NativeModules

	useEffect(() => {
		initNavigation()
	}, [])

	const initNavigation = async () => {
		const res = await RNNavigationModule.getInitialNavigationParams()
		console.log('initNavigation', res)
		const { screen, jsonParams } = res
		if (screen) {
			Navigation.navigate(screen, jsonParams)
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
		<Loading/>
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
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppContainer

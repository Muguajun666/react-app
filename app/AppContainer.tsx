/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TestScreen from './views/Test'
import VoiceRoomScreen from './views/VoiceRoom'
import { Button, Text, View } from 'react-native'
import Navigation from './navigation/appNavigation'

const Stack = createNativeStackNavigator()

function HomeScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Home Screen</Text>
			<View className="mt-4">
				<Button
					title="跳转至测试页"
					onPress={() => {
						Navigation.navigate('Test')
					}}
				></Button>
			</View>
		</View>
	)
}

const AppContainer = (): React.JSX.Element => {
	return (
		<NavigationContainer ref={Navigation.navigationRef}>
			<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true, animation: 'none' }}>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Test" component={TestScreen} />
				<Stack.Screen name="VoiceRoom" component={VoiceRoomScreen} options={{ headerShown: false }}/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppContainer

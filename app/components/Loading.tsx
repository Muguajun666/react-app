import React from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'

function Loading() {
	return (
		<View style={styles.loadingScreen}>
			<ActivityIndicator size="large" color={'#66a3feFF'} />
			<Text style={{marginTop: 10}}>正在加载中...</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	loadingScreen: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default Loading

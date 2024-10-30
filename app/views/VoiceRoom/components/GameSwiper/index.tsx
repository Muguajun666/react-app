import { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { TGameInfo } from '../../type'

interface GameSwiperProps {
	showsButtons?: boolean
	autoplay?: boolean
  swiperData?: TGameInfo[]
}

const GameSwiper = (props: GameSwiperProps): React.JSX.Element => {
	const { showsButtons, autoplay = true, swiperData = [] } = props

  const renderSwiperItem = (item: TGameInfo) => {
    return (
      <View style={styles.slideWrapper} key={item.name}>
        <Text>{item.name}</Text>
      </View>
    )
  }

	return (
		<Swiper
			showsButtons={showsButtons}
			autoplay={autoplay}
			activeDotColor="#fff"
			style={styles.wrapper}
			paginationStyle={styles.pagination}
		>
			{swiperData?.map((item) => renderSwiperItem(item))}
		</Swiper>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		marginTop: 190,
    marginLeft: 10
	},
	slideWrapper: {
		width: 60,
		height: 60,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	pagination: {
		bottom: 10,
    left: 10
	}
})

export default GameSwiper

import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import FontistoIcon from 'react-native-vector-icons/Fontisto'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { StyleProp, ViewStyle } from 'react-native'

interface IconProps {
	iconFamily: string
	name: string
	size: number
	color: string
	style?: StyleProp<ViewStyle>
}

const Icon = (props: IconProps): React.JSX.Element => {
	const { iconFamily, name, size, color, style } = props

	switch (iconFamily) {
		case 'AntDesign':
			return <AntDesignIcon name={name} size={size} color={color} style={style} />
		case 'Entypo':
			return <EntypoIcon name={name} size={size} color={color} style={style} />
		case 'Ionicons':
			return <IoniconsIcon name={name} size={size} color={color} style={style} />
		case 'Fontisto':
			return <FontistoIcon name={name} size={size} color={color} style={style} />
		case 'FontAwesome5':
			return <FontAwesome5Icon name={name} size={size} color={color} style={style} />
	}

	return <></>
}

export default Icon

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { StyleSheet } from 'react-native'

interface BottomSheetProps {
	children?: React.JSX.Element
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
	const { children } = props

	return (
		<BottomSheet ref={ref} index={-1} enablePanDownToClose style={styles.container}>
			<BottomSheetView style={styles.contentContainer}>{children}</BottomSheetView>
		</BottomSheet>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'grey'
	},
	contentContainer: {
		flex: 1,
		padding: 36,
		alignItems: 'center'
	}
})

export default BottomSheetComponent

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { Image, Pressable, StyleSheet, Text } from 'react-native'

interface BottomSheetProps {
  checkRelationship?: () => void
	userHandle?: () => void
	onOpen?: () => void
	onClose?: () => void
	closeHandle?: () => void
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
	const { onOpen, onClose, userHandle, closeHandle, checkRelationship } = props

	const sheetIndexChange = (index: number) => {
		if (index === -1) {
			onClose && onClose()
		} else if (index === 0) {
			onOpen && onOpen()
		}
	}

	return (
		<BottomSheet
			ref={ref}
			index={-1}
			enablePanDownToClose
			style={styles.container}
			onChange={sheetIndexChange}
		>
			<BottomSheetView style={styles.contentContainer}>
				<Pressable onPress={() => userHandle && userHandle()} style={[styles.buttonContainer, {marginTop: 10}]}>
					<Image
						source={require('../../../../assets/images/buttonBg.png')}
						style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 8 }}
					/>
					<Text style={{ fontSize: 16, fontWeight: 400, color: '#9605EC' }}>Add friends/Send message</Text>
				</Pressable>
				<Pressable onPress={() => closeHandle && closeHandle()} style={[styles.buttonContainer, {marginBottom: 16, marginTop: 16}]}>
					<Text style={{ fontSize: 16, fontWeight: 400, color: '#000000' }}>Cancel</Text>
				</Pressable>
			</BottomSheetView>
		</BottomSheet>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	},
	contentContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	buttonContainer: {
		width: 343,
		height: 50,
		borderWidth: 1,
		borderColor: '#E0E0E0',
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default BottomSheetComponent

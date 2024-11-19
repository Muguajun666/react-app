import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { languageConfig } from '../config'

interface BottomSheetProps {
	onSelect?: (value: string) => void
	closeHandle?: () => void
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
	const { onSelect, closeHandle } = props

	return (
		<BottomSheet ref={ref} index={-1} enablePanDownToClose style={styles.container}>
			<BottomSheetView style={styles.contentContainer}>
				<View style={styles.languageContainer}>
					{languageConfig.map((item, index) => (
						<Pressable
							key={index}
							onPress={() => onSelect && onSelect(item.value)}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderColor: '#E0E0E0',
								width: 343,
								height: 50,
								borderTopWidth: index === 0 ? 0 : 1
							}}
						>
							<Text style={{ fontSize: 16, fontWeight: 400, color: '#000000' }}>{item.label}</Text>
						</Pressable>
					))}
				</View>
				<Pressable
					onPress={() => closeHandle && closeHandle()}
					style={[styles.buttonContainer, { marginBottom: 16, marginTop: 16 }]}
				>
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
	languageContainer: {
		width: 343,
		borderWidth: 1,
		borderColor: '#E0E0E0',
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
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

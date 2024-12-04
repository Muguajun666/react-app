import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef, useCallback, useMemo } from 'react'
import { Image, Pressable, StyleSheet, Text } from 'react-native'

interface BottomSheetProps {
	onStandup?: () => void
	closeHandle?: () => void
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
	const {onStandup, closeHandle } = props

	const snapPoints = useMemo(() => ['25%'], [])
	
	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				pressBehavior={'close'}
			/>
		),
		[]
	)

	return (
		<BottomSheet
			ref={ref}
			index={-1}
			snapPoints={snapPoints}
			backdropComponent={renderBackdrop}
			enableDynamicSizing={false}
			enableContentPanningGesture={false}
			style={styles.container}
		>
			<BottomSheetView style={styles.contentContainer}>
				<Pressable onPress={() => onStandup && onStandup()} style={[styles.buttonContainer, {marginTop: 10}]}>
					<Image
						source={require('../../../../assets/images/buttonBg.png')}
						style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 8 }}
					/>
					<Text style={{ fontSize: 16, fontWeight: 400, color: '#9605EC' }}>Stand up</Text>
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

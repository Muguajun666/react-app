import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { Image, Pressable, StyleSheet, Text } from 'react-native'

interface BottomSheetProps {
	checkRelationship?: (fn: any) => void
	userHandle?: (type: 'add_friend' | 'send_message', refTag: 'MasterToUser' | 'UserToUser') => void
	onKickOut?: () => void
	onMute?: () => void
	closeHandle?: () => void
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
	const { onKickOut, closeHandle, userHandle, onMute, checkRelationship } = props

	const [isFriend, setIsFriend] = useState(false)

	const snapPoints = useMemo(() => ['40%'], [])

	const handleSheetChange = useCallback((index: number) => {
		if (index === 0) {
			checkRelationship && checkRelationship(setIsFriend)
		}
	}, [])

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
			onChange={handleSheetChange}
			style={styles.container}
		>
			<BottomSheetView style={styles.contentContainer}>
				<Pressable
					onPress={() =>
						userHandle && userHandle(isFriend ? 'send_message' : 'add_friend', 'MasterToUser')
					}
					style={[styles.buttonContainer, { marginTop: 10 }]}
				>
					<Image
						source={require('../../../../assets/images/buttonBg.png')}
						style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 8 }}
					/>
					<Text style={{ fontSize: 16, fontWeight: 400, color: '#9605EC' }}>
						{isFriend ? 'Send message' : 'Add friends'}
					</Text>
				</Pressable>
				<Pressable
					onPress={() => onKickOut && onKickOut()}
					style={[styles.buttonContainer, { marginTop: 10 }]}
				>
					<Image
						source={require('../../../../assets/images/buttonBg.png')}
						style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 8 }}
					/>
					<Text style={{ fontSize: 16, fontWeight: 400, color: '#9605EC' }}>Kick out</Text>
				</Pressable>
				<Pressable
					onPress={() => onMute && onMute()}
					style={[styles.buttonContainer, { marginTop: 10 }]}
				>
					<Image
						source={require('../../../../assets/images/buttonBg.png')}
						style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 8 }}
					/>
					<Text style={{ fontSize: 16, fontWeight: 400, color: '#9605EC' }}>Mute</Text>
				</Pressable>
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

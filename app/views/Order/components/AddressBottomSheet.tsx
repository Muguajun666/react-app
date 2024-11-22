import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { TAddressList } from '../../../services/type'
import Loading from '../../../components/Loading'
import { getReceiveAddressApi } from '../../../services/api/address'
import { paramsToGetParamsStr } from '../../../utils'
import { LISTENER } from '../../../components/Toast'
import EventEmitter from '../../../utils/emitter'

interface BottomSheetProps {
	onConfirm?: (address: TAddressList) => void
	closeHandle?: () => void
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
	const { closeHandle, onConfirm } = props

	const [addressList, setAddressList] = useState<TAddressList[]>([])
	const [selectedAddress, setSelectedAddress] = useState<TAddressList | null>(null)
	const [isLoading, setLoading] = useState(false)

	const snapPoints = useMemo(() => ['40%'], [])

	const handleSheetChange = useCallback((index: number) => {
		if (index === 0) {
			getAddressList()
		} else {
      setAddressList([])
    }
	}, [])

	const getAddressList = async () => {
		setLoading(true)

		const paramsStr = paramsToGetParamsStr({ pageNum: 1, pageSize: 100 })

		const res: any = await getReceiveAddressApi(paramsStr)

		if (res.success) {
			if (res.object.list.length > 0) {
				setSelectedAddress(res.object.list.find((item: TAddressList) => item.isDefault))
			}
			setAddressList(res.object.list)
			setLoading(false)
		}
	}

	const confirmHandle = () => {
    if (selectedAddress) {
      onConfirm && onConfirm(selectedAddress)
    } else {
      EventEmitter.emit(LISTENER, {
        message: 'none address selected'
      })
    }
  }

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
			{isLoading ? (
				<Loading />
			) : (
				<>
					{addressList.length > 0 ? (
						<BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
							{addressList.map((item: TAddressList, index: number) => {
								return (
									<Pressable
										key={item.id}
										onPress={() => setSelectedAddress(item)}
										style={[styles.addressItem, { borderTopWidth: index === 0 ? 0 : 1 }]}
									>
										<View style={styles.addressItemInfo}>
											<View
												className="flex-row justify-between items-center"
												style={{ marginBottom: 5 }}
											>
												<Text style={{ fontSize: 15, color: '#333333FF' }}>{item.receiver}</Text>
												<Text style={{ fontSize: 13, color: '#333333FF' }}>{item.telephone}</Text>
											</View>
											<Text style={{ fontSize: 13, color: '#666666FF' }}>{item.address}</Text>
										</View>
										{item.id === selectedAddress?.id && (
											<Image
												source={require('../../../assets/images/check.png')}
												style={{ width: 20, height: 20 }}
											/>
										)}
									</Pressable>
								)
							})}
						</BottomSheetScrollView>
					) : (
						<View style={styles.imageContainer}>
							<Image
								source={require('../../../assets/images/address.png')}
								style={{ width: 89, height: 89 }}
							/>
							<Text style={{ fontSize: 13, color: '#999999FF' }}>
								You don't have a saved address yet
							</Text>
						</View>
					)}
				</>
			)}

			<View style={styles.buttonContainer}>
				<Pressable onPress={() => closeHandle?.()} style={styles.cancel}>
					<Text style={{ fontSize: 16, color: '#9605EC' }}>Cancel</Text>
				</Pressable>
				<Pressable onPress={() => confirmHandle()} style={styles.confirm}>
					<Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 500 }}>Confirm</Text>
				</Pressable>
			</View>
		</BottomSheet>
	)
})

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	imageContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	contentContainer: {
		backgroundColor: '#FFFFFF'
	},
	buttonContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 60,
		marginTop: 10,
		marginBottom: 15
	},
	cancel: {
		width: 130,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: '#C161FCFF',
		backgroundColor: '#fff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	confirm: {
		width: 130,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: '#C161FCFF',
		backgroundColor: '#C161FCFF',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addressItem: {
		width: '100%',
		height: 60,
		borderTopColor: '#E5E5E5FF',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	addressItemInfo: {
		width: 290,
		paddingLeft: 10,
		paddingRight: 20
	}
})

export default BottomSheetComponent

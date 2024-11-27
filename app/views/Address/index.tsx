import React, { useEffect, useState } from 'react'
import {
	Image,
	NativeModules,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View
} from 'react-native'
import Icon from '../../components/Icon'
import Navigation from '../../navigation/appNavigation'
import {
	deleteAddressApi,
	getReceiveAddressApi,
	setDefaultAddressApi
} from '../../services/api/address'
import { paramsToGetParamsStr } from '../../utils'
import { TAddressList } from '../../services/type'
import AddressSetter from './AddressSetter'
import Switch from '../../components/Switch'
import Dialog from '../../components/Dialog'
import Loading from '../../components/Loading'
import { LISTENER } from '../../components/Toast'
import EventEmitter from '../../utils/emitter'

const Address = (): React.JSX.Element => {
	const { RNNavigationModule } = NativeModules

	const [addressList, setAddressList] = useState<TAddressList[]>([])

	const [pageNum, setPageNum] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [pageTotal, setPageTotal] = useState(0)

	const [showSetter, setShowSetter] = useState(false)
	const [setterParams, setSetterParams] = useState({})
	const [setterType, setSetterType] = useState<'Add' | 'Edit'>('Add')

	const [showDialog, setShowDialog] = useState(false)
	const [selectedId, setSelectedId] = useState(0)

	const [isLoading, setLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

	useEffect(() => {
		getAddressList(true)
	}, [])

	const onRefresh = () => {
		setRefreshing(true)
		getAddressList(true)
	}

	const getAddressList = async (reset: boolean = false) => {
		if (reset) {
			setLoading(true)
			setPageNum(1)
		}

		let paramsStr = ''

		if (reset) {
			paramsStr = paramsToGetParamsStr({ pageNum: 1, pageSize })
		} else {
			paramsStr = paramsToGetParamsStr({ pageNum, pageSize })
		}

		const res: any = await getReceiveAddressApi(paramsStr)
		if (res.success) {
			if (reset) {
				setAddressList(res.object.list)
			} else {
				setAddressList((prev) => {
					return [...prev, ...res.object.list]
				})
			}
			setPageTotal(res.object.total)
			setPageNum((prev) => prev + 1)
			setLoading(false)
			setRefreshing(false)
		}
	}

	const backHandle = () => {
		// Navigation.back()
		RNNavigationModule.backToAndroid()
	}

	const addHandle = () => {
		setSetterType('Add')
		setSetterParams({})
		setShowSetter(true)
	}

	const editHandle = (item: TAddressList) => {
		setSetterType('Edit')
		setSetterParams({
			id: item.id,
			name: item.receiver,
			address: item.address,
			phone: item.telephone
		})
		setShowSetter(true)
	}

	const showDeleteDialog = (item: TAddressList) => {
		setSelectedId(item.id)
		setShowDialog(true)
	}

	const deleteHandle = async () => {
		const res: any = await deleteAddressApi(selectedId)
		if (res.success) {
			getAddressList(true)
		} else {
			EventEmitter.emit(LISTENER, {
				message: res.message
			})
		}
		setShowDialog(false)
	}

	const defaultHandle = async (item: TAddressList) => {
		if (item.isDefault) {
			return
		}
		const res: any = await setDefaultAddressApi(item.id)
		if (res.success) {
			// getAddressList(true)
			setAddressList((prev) => {
				return prev.map((i) => {
					return {
						...i,
						isDefault: item.id === i.id
					}
				})
			})
		}
	}

	const scrollHandle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent
		const height = contentSize.height
		const offset = contentOffset.y
		const maxScroll = height - layoutMeasurement.height

		if (offset >= maxScroll) {
			console.log('Reached bottom!')
			if (addressList.length < pageTotal) {
				getAddressList()
			}
		}
	}
	return (
		<View className="w-full h-full">
			{/* header */}
			<View style={styles.header}>
				<Pressable onPress={backHandle} style={styles.backIcon}>
					<Icon iconFamily="AntDesign" name="left" size={25} color="#000" />
				</Pressable>
				<Text style={styles.headerText}>My address</Text>
			</View>
			{/* address */}
			{isLoading ? (
				<Loading />
			) : (
				<View style={styles.addressContainer}>
					{addressList.length > 0 ? (
						<ScrollView
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={onRefresh}
									colors={['#34c759FF']}
									title="正在加载..."
								/>
							}
							onScroll={scrollHandle}
							className="w-full"
							style={{ maxHeight: 560 }}
						>
							{addressList.map((item: TAddressList, index) => {
								return (
									<View
										style={[styles.addressItem, { marginTop: index === 0 ? 0 : 10 }]}
										key={item.id}
									>
										<View style={styles.addressInfo}>
											<View className="flex flex-row items-center justify-between">
												<Text style={{ fontSize: 15, color: '#333333FF' }}>{item.receiver}</Text>
												<Text style={{ fontSize: 13, color: '#333333FF' }}>{item.telephone}</Text>
											</View>
											<Text style={{ fontSize: 13, color: '#666666FF' }}>{item.address}</Text>
										</View>
										<View style={styles.addressOperation}>
											<View className="flex flex-row items-center">
												<Switch
													checked={item.isDefault}
													onCheckedChange={() => defaultHandle(item)}
													style={{ width: 40, height: 20, padding: 1 }}
													trackColors={{ on: '#34c759FF', off: '#d8d8d8FF' }}
												/>
												<Text style={{ fontSize: 13, color: '#333333FF', marginLeft: 5 }}>
													Default address
												</Text>
											</View>
											<View className="flex flex-row items-center" style={{ gap: 30 }}>
												<Pressable onPress={() => showDeleteDialog(item)}>
													<Image
														source={require('../../assets/images/delete.png')}
														style={{ width: 18, height: 18 }}
													/>
												</Pressable>
												<Pressable onPress={() => editHandle(item)}>
													<Image
														source={require('../../assets/images/edit.png')}
														style={{ width: 18, height: 18 }}
													/>
												</Pressable>
											</View>
										</View>
									</View>
								)
							})}
						</ScrollView>
					) : (
						<View className="flex justify-center items-center" style={{ marginTop: 100 }}>
							<Image
								source={require('../../assets/images/address.png')}
								style={{ width: 89, height: 89 }}
							/>
							<Text style={{ fontSize: 13, color: '#999999FF', marginTop: 5 }}>
								You don't have a saved address yet
							</Text>
						</View>
					)}
				</View>
			)}
			{/* add-address */}
			<View style={styles.add}>
				<Pressable onPress={addHandle} style={[styles.addButton]}>
					<Icon iconFamily="AntDesign" name="plus" size={22} color="#FFF" />
					<Text style={{ fontSize: 18, fontWeight: 500, color: '#FFFFFFFF' }}>Add an address</Text>
				</Pressable>
			</View>
			{showSetter && (
				<AddressSetter
					refreshHandle={() => getAddressList(true)}
					closeHandle={() => setShowSetter(false)}
					type={setterType}
					params={setterParams}
				/>
			)}
			{showDialog && (
				<Dialog
					visible={showDialog}
					title={'Address deleted'}
					description={'Do you want to delete this address?'}
					handleCancel={() => setShowDialog(false)}
					handleConfirm={() => deleteHandle()}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		height: 50,
		position: 'relative',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0'
	},
	backIcon: {
		position: 'absolute',
		left: 10,
		top: 13
	},
	headerText: {
		fontSize: 20,
		fontWeight: 600,
		color: '#000000'
	},
	add: {
		position: 'absolute',
		left: 0,
		bottom: 26,
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 16,
		paddingRight: 16
	},
	addButton: {
		width: 343,
		height: 52,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 26,
		backgroundColor: '#B34EFAFF',
		gap: 10
	},
	addressContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: '#f3f3f3FF'
	},
	addressItem: {
		height: 130,
		backgroundColor: '#fff',
		display: 'flex',
		flexDirection: 'column'
	},
	addressInfo: {
		height: 81,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		paddingLeft: 14,
		paddingRight: 14,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		gap: 15
	},
	addressOperation: {
		height: 49,
		paddingLeft: 14,
		paddingRight: 14,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
})

export default Address

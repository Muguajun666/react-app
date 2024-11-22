import {
	Image,
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
import { useEffect, useRef, useState } from 'react'
import { applyOrderApi, getOrderApi, recycleOrderApi } from '../../services/api/order'
import { paramsToGetParamsStr } from '../../utils'
import { TAddressList, TOrderList } from '../../services/type'
import Loading from '../../components/Loading'
import { IMG_BASE_URL } from '@env'
import Dialog from '../../components/Dialog'
import { LISTENER } from '../../components/Toast'
import EventEmitter from '../../utils/emitter'
import AddressBottomSheet from './components/AddressBottomSheet'
import BottomSheet from '@gorhom/bottom-sheet'

const Order = (): React.JSX.Element => {
	const addressBottomSheetRef = useRef<BottomSheet>(null)

	const [tabValue, setTabValue] = useState(0)

	const [pageNum, setPageNum] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [pageTotal, setPageTotal] = useState(0)

	const [orderList, setOrderList] = useState<TOrderList[]>([])
	const [selectedItem, setSelectedItem] = useState<TOrderList | null>(null)
	const [showDialog, setShowDialog] = useState(false)

	const [isLoading, setLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)

	useEffect(() => {
		getOrderList(true)
	}, [])

	const onRefresh = () => {
		setRefreshing(true)
		getOrderList(true)
	}

	const getOrderList = async (reset: boolean = false, tab?: number) => {
		if (reset) {
			setPageNum(1)
			setLoading(true)
		}

		const activeTab = tab !== undefined ? tab : tabValue

		const orderStatus = activeTab === 0 ? '' : activeTab === 1 ? 'ORDERED' : 'DELIVERED'

		let paramsStr = ''

		if (reset) {
			paramsStr = paramsToGetParamsStr({ orderStatus, pageNum: 1, pageSize })
		} else {
			paramsStr = paramsToGetParamsStr({ orderStatus, pageNum, pageSize })
		}

		const res: any = await getOrderApi(paramsStr)

		if (res.success) {
			if (reset) {
				setOrderList(res.object.list)
			} else {
				setOrderList((prev) => {
					return [...prev, ...res.object.list]
				})
			}
			setPageTotal(res.object.total)
			setPageNum((prev) => prev + 1)
			setLoading(false)
			setRefreshing(false)
		}
	}

	const tabChangeHandle = (tab: number) => {
		if (tabValue === tab) return
		setTabValue(tab)
		getOrderList(true, tab)
	}

	const backHandle = () => {
		Navigation.back()
	}

	const scrollHandle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent
		const height = contentSize.height
		const offset = contentOffset.y
		const maxScroll = height - layoutMeasurement.height

		if (offset >= maxScroll) {
			console.log('Reached bottom!')
			if (orderList.length < pageTotal) {
				getOrderList()
			}
		}
	}

	const showRecycleDialog = (item: TOrderList) => {
		setSelectedItem(item)
		setShowDialog(true)
	}

	const showBottomSheet = (item: TOrderList) => {
		setSelectedItem(item)
		addressBottomSheetRef.current?.expand()
	}

	const applyHandle = async (address: TAddressList) => {
		const params = {
			id: Number(selectedItem?.id),
			address: address.address,
			receiver: address.receiver,
			telephone: address.telephone
		}

		const res: any = await applyOrderApi(params)

		if (res.success) {
			addressBottomSheetRef.current?.close()
			getOrderList(true)
		} else {
			EventEmitter.emit(LISTENER, {
				message: res.message
			})
		}
	}

	const recycleHandle = async () => {
		const res: any = await recycleOrderApi(selectedItem?.id!)
		if (res.success) {
			getOrderList(true)
		} else {
			EventEmitter.emit(LISTENER, {
				message: res.message
			})
		}
		setShowDialog(false)
	}

	return (
		<View className="w-full h-full">
			{/* header */}
			<View style={styles.header}>
				<Pressable onPress={backHandle} style={styles.backIcon}>
					<Icon iconFamily="AntDesign" name="left" size={25} color="#000" />
				</Pressable>
				<Text style={styles.headerText}>My Orders</Text>
			</View>
			{/* tabs */}
			<View style={styles.tabs}>
				<Pressable style={styles.tabItem} onPress={() => tabChangeHandle(0)}>
					<Text style={[styles.tabText, tabValue === 0 && styles.tabTextActive]}>
						My merchandise
					</Text>
					{tabValue === 0 && <View style={styles.indicator} />}
				</Pressable>
				<Pressable style={styles.tabItem} onPress={() => tabChangeHandle(1)}>
					<Text style={[styles.tabText, tabValue === 1 && styles.tabTextActive]}>
						To be shipped
					</Text>
					{tabValue === 1 && <View style={styles.indicator} />}
				</Pressable>
				<Pressable style={styles.tabItem} onPress={() => tabChangeHandle(2)}>
					<Text style={[styles.tabText, tabValue === 2 && styles.tabTextActive]}>Shipped</Text>
					{tabValue === 2 && <View style={styles.indicator} />}
				</Pressable>
			</View>
			{/* content */}
			{isLoading ? (
				<Loading />
			) : (
				<View style={styles.contentContainer}>
					{orderList.length > 0 ? (
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
							style={{ maxHeight: 615 }}
						>
							{orderList.map((item: TOrderList, index) => {
								return (
									<View
										style={[
											styles.orderItem,
											{
												marginTop: index === 0 ? 0 : 10,
												height: item.orderStatus === 'INIT' ? 172 : 110
											}
										]}
										key={item.id}
									>
										{/* order-info */}
										<View
											style={[
												styles.orderInfo,
												{ borderBottomWidth: item.orderStatus === 'INIT' ? 1 : 0 }
											]}
										>
											<Image
												source={{ uri: `${IMG_BASE_URL}${item.goodsImg}` }}
												style={{
													width: 80,
													height: 80,
													borderRadius: 10,
													backgroundColor: '#E0E0E0'
												}}
											/>
											<View className="flex flex-col" style={{ flex: 1, gap: 10 }}>
												<View className="flex flex-row justify-between">
													<Text style={{ fontSize: 14, color: '#000000', fontWeight: 500 }}>
														{item.goodsName}
													</Text>
													<Text
														style={{
															color:
																item.orderStatus === 'RECYCLED'
																	? '#f94a49FF'
																	: item.orderStatus === 'ORDERED'
																	? '#607cffFF'
																	: '#b34efaFF'
														}}
													>
														{item.orderStatus !== 'INIT' && item.orderStatus}
													</Text>
												</View>
												<Text style={{ fontSize: 13, color: '#333333' }}>
													Redeem points: {item.integralPrice}
												</Text>
												<View className="flex flex-row justify-between">
													<Text style={{ fontSize: 13, color: '#F83665' }}>
														Recover points: {item.recycleIntegralPrice}
													</Text>
													<Text style={{ fontSize: 14, color: '#000000', fontWeight: 500 }}>
														Value: {item.goodsPrice}
													</Text>
												</View>
											</View>
										</View>
										{/* operation */}
										{item.orderStatus === 'INIT' && (
											<View style={styles.operation}>
												<Pressable style={styles.apply} onPress={() => showBottomSheet(item)}>
													<Text style={{ fontSize: 12, color: '#000000', fontWeight: 500 }}>
														Apply for shipment
													</Text>
												</Pressable>
												<Pressable style={styles.recover} onPress={() => showRecycleDialog(item)}>
													<Text style={{ fontSize: 12, color: '#ffffff', fontWeight: 500 }}>
														Recover points
													</Text>
												</Pressable>
											</View>
										)}
									</View>
								)
							})}
						</ScrollView>
					) : (
						<View className="flex justify-center items-center" style={{ marginTop: 170 }}>
							<Image
								source={require('../../assets/images/nullorder.png')}
								style={{ width: 230, height: 115 }}
							/>
						</View>
					)}
				</View>
			)}
			{showDialog && (
				<Dialog
					visible={showDialog}
					title={'Order recycled'}
					description={'Do you want to recycle this order?'}
					handleCancel={() => setShowDialog(false)}
					handleConfirm={() => recycleHandle()}
				/>
			)}
			<AddressBottomSheet
				ref={addressBottomSheetRef}
				onConfirm={applyHandle}
				closeHandle={() => addressBottomSheetRef.current?.close()}
			/>
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
	tabs: {
		height: 42,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	tabItem: {
		flex: 1,
		backgroundColor: '#fff',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	tabText: {
		fontSize: 14,
		color: '#999999',
		marginTop: 9
	},
	tabTextActive: {
		fontWeight: 'bold',
		color: '#000000'
	},
	indicator: {
		width: 30,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#B34EFAFF',
		marginBottom: 3
	},
	contentContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: '#f3f3f3FF'
	},
	orderItem: {
		height: 172,
		backgroundColor: '#fff',
		display: 'flex',
		flexDirection: 'column'
	},
	orderInfo: {
		height: 110,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		paddingLeft: 15,
		paddingRight: 15,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	operation: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingLeft: 15,
		paddingRight: 15,
		gap: 10
	},
	apply: {
		width: 127,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#f1f1f1FF',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	recover: {
		width: 127,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#b34efaFF',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default Order

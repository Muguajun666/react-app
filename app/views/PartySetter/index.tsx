import { Image, NativeModules, Pressable, StyleSheet, Text, View } from 'react-native'
import Navigation from '../../navigation/appNavigation'
import Icon from '../../components/Icon'
import { Input } from '../../components/ui/input'
import React, { useEffect, useRef } from 'react'
import { labelConfig, languageConfig } from './config'
import Switch from '../../components/Switch'
import LanguageBottomSheet from './components/LanguageBottomSheet'
import BottomSheet from '@gorhom/bottom-sheet'
import { launchImageLibrary } from 'react-native-image-picker'
import { getUploadTempAuthUrl } from '../../services/api/upload'
import { IMG_BASE_URL } from '@env'
import { LISTENER } from '../../components/Toast'
import EventEmitter from '../../utils/emitter'
import {
	ICreateRoomParams,
	IResponse,
	ImTokenObject,
	RtcTokenObject,
	TRoomListItem
} from '../../services/type'
import {
	createOrSetRoomApi,
	getImTokenApi,
	getMyOwnRoomApi,
	getRtcTokenApi,
	joinRoomApi
} from '../../services/api/voice'
import { rsaEncrypt } from '../../utils/crypto'
import { useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux'

export type PartySetterParams = {
	key: string
	name: string
	params: ICreateRoomParams
}

const PartySetter = (): React.JSX.Element => {
	const { params } = useRoute<PartySetterParams>()

	const { coverImg, id, isPrivate, label, language, password, subject } = params

	const userInfo = useSelector((state: any) => state.user.userInfo)

	useEffect(() => {
		if (id) {
			setMode('edit')
			setRoomName(subject)
			setLabelValue(label!)
			setPasswordChecked(isPrivate!)
			setPasswordValue(password!)
			setSelectedCover(coverImg!)
			setLanguageValue(language!)
		}
	}, [])

	const { VoiceRoomModule, RNNavigationModule } = NativeModules

	const languageBottomSheetRef = useRef<BottomSheet>(null)

	const [mode, setMode] = React.useState('create')

	const [languageValue, setLanguageValue] = React.useState('en-US')

	const [roomName, setRoomName] = React.useState('')

	const [labelValue, setLabelValue] = React.useState(-1)

	const [passwordChecked, setPasswordChecked] = React.useState(false)

	const [passwordValue, setPasswordValue] = React.useState('')

	const [selectedCover, setSelectedCover] = React.useState('')

	const backHandle = () => {
		if (mode === 'edit') {
			Navigation.back()
		} else {
			RNNavigationModule.backToAndroid()
		}
	}
	const languageHandle = () => {
		languageBottomSheetRef.current?.expand()
	}

	const selectLanguageHandle = (value: string) => {
		setLanguageValue(value)
		languageBottomSheetRef.current?.close()
	}

	const coverHandle = () => {
		launchImageLibrary(
			{
				mediaType: 'photo',
				selectionLimit: 1
			},
			(res) => {
				console.log(res)
				if (res.didCancel) {
					return false
				}
				const { fileName, originalPath } = res.assets![0]

				getUploadTempAuthUrl([fileName]).then(async (res: any) => {
					console.log('getUploadTempAuthUrl', res)
					if (res.success) {
						const { fileUrl, contentType, fileKey } = res.object[0]

						const result = await VoiceRoomModule.uploadFile({
							url: fileUrl,
							contentType,
							filePath: originalPath
						})

						if (result) {
							setSelectedCover(fileKey)
						} else {
							EventEmitter.emit(LISTENER, { message: '上传失败！' })
						}
					}
				})
			}
		)
	}

	const selectLabelHandle = (value: number) => {
		if (labelValue === value) return
		console.log('selectLabelHandle', value)
		setLabelValue(value)
	}

	const confirmHandle = async () => {
		console.log('confirmHandle')
		if (!roomName) {
			EventEmitter.emit(LISTENER, { message: '请输入房间名称！' })
			return
		}
		if (!selectedCover) {
			EventEmitter.emit(LISTENER, { message: '请选择封面！' })
			return
		}
		if (labelValue === -1) {
			EventEmitter.emit(LISTENER, { message: '请选择标签！' })
			return
		}
		if (passwordChecked && !passwordValue) {
			EventEmitter.emit(LISTENER, { message: '请输入密码！' })
			return
		}

		if (mode === 'create') {
			const params: ICreateRoomParams = {
				coverImg: selectedCover,
				isPrivate: passwordChecked,
				label: labelValue,
				language: languageValue,
				password: passwordChecked ? passwordValue : '',
				subject: roomName
			}

			const result: any = await createOrSetRoomApi(params)
			console.log('createOrSetRoomApi', result)

			if (result.success) {
				// RNNavigationModule.backToAndroid()
				// 直接进入房间
				const myRoomRes: any = await getMyOwnRoomApi()
				console.log('getMyOwnRoomApi', myRoomRes)
				if (myRoomRes.success) {
					const room = myRoomRes.object
					creatRoomHandle(room)
				}
			} else {
				EventEmitter.emit(LISTENER, { message: result.message })
			}

		} else if (mode === 'edit') {
			const params: ICreateRoomParams = {
				id: id,
				coverImg: selectedCover,
				isPrivate: passwordChecked,
				label: labelValue,
				language: languageValue,
				password: passwordChecked ? passwordValue : '',
				subject: roomName
			}

			const result: any = await createOrSetRoomApi(params)
			console.log('createOrSetRoomApi', result)
			if (result.success) {
				Navigation.back()
			} else {
				EventEmitter.emit(LISTENER, { message: result.message })
			}
		}
	}

	const creatRoomHandle = async (room: TRoomListItem) => {
		console.log('加入房间', room)

		const joinRoomRes = (await joinRoomApi({ id: room.id! })) as IResponse<any>
		console.log('joinRoomRes', joinRoomRes)
		if (!joinRoomRes.success) return

		const rtctokenRes = (await getRtcTokenApi({
			roomId: room.aliRoomId!
		})) as IResponse<RtcTokenObject>
		console.log('rtctokenRes', rtctokenRes)
		if (!rtctokenRes.success) return

		const imTokenRes = (await getImTokenApi()) as IResponse<ImTokenObject>
		console.log('imTokenRes', imTokenRes)
		if (!imTokenRes.success) return

		const creatRoomRes = await VoiceRoomModule.createVoiceRoom(
			userInfo,
			imTokenRes.object,
			rtctokenRes.object,
			room
		)

		const { result, msg } = creatRoomRes
		console.log('creatRoomRes', result, msg)
		if (result) {
			Navigation.replace('VoiceRoom', room)
		}
	}

	return (
		<View className="w-full h-full">
			<Image source={require('../../assets/images/setterBg.png')} style={styles.absolute} />
			{/* header */}
			<View style={styles.header}>
				<Pressable onPress={backHandle} style={styles.backIcon}>
					<Icon iconFamily="AntDesign" name="arrowleft" size={25} color="#000" />
				</Pressable>
				<Text style={styles.headerText}>Create a party</Text>
			</View>
			{/* language */}
			<Pressable onPress={languageHandle} style={styles.language}>
				<Text style={styles.labelText}>Party language</Text>
				<View className="flex flex-row items-center" style={{ gap: 5 }}>
					<Text>{languageConfig.find((item) => item.value === languageValue)?.label}</Text>
					<Icon iconFamily="AntDesign" name="right" size={16} color="#333333FF" />
				</View>
			</Pressable>
			{/* theme */}
			<View style={styles.theme}>
				<Text style={styles.labelText}>Party theme</Text>
				<View style={styles.inputWrapper}>
					<Input
						style={styles.input}
						placeholder="Please enter room name"
						placeholderTextColor={'#969696FF'}
						value={roomName}
						onChangeText={(text) => {
							setRoomName(text)
						}}
					/>
				</View>
			</View>
			{/* cover */}
			<View style={styles.cover}>
				<Text style={styles.labelText}>Room cover</Text>
				<Pressable onPress={coverHandle} style={styles.imageContainer}>
					{selectedCover ? (
						<Image source={{ uri: `${IMG_BASE_URL}${selectedCover}` }} style={styles.coverImage} />
					) : (
						<Icon iconFamily="AntDesign" name="plus" size={24} color="#d8d8d8FF" />
					)}
				</Pressable>
			</View>
			{/* label */}
			<View style={styles.label}>
				<Text style={styles.labelText}>Select label</Text>
				<View style={styles.labelContainer}>
					{labelConfig.map((item) => {
						return (
							<Pressable
								key={item.value}
								style={[
									styles.labelItem,
									{ backgroundColor: labelValue === item.value ? '#66a3feFF' : '#f5f5f5FF' }
								]}
								onPress={selectLabelHandle.bind(this, item.value)}
							>
								<Icon
									iconFamily={item.iconFamily!}
									name={item.iconName!}
									size={16}
									color={labelValue === item.value ? '#ffffffFF' : '#999999FF'}
								/>
								<Text
									style={{
										fontSize: 11,
										color: labelValue === item.value ? '#ffffffFF' : '#999999FF'
									}}
								>
									{item.label}
								</Text>
							</Pressable>
						)
					})}
				</View>
			</View>
			{/* password */}
			<View style={styles.password}>
				<View className="flex flex-row items-center justify-between">
					<Text style={styles.labelText}>Secret Party Password</Text>
					<Switch
						checked={passwordChecked}
						onCheckedChange={setPasswordChecked}
						style={{ width: 46, height: 24, padding: 2 }}
						trackColors={{ on: '#66a3feFF', off: '#d8d8d8FF' }}
					/>
				</View>
				{passwordChecked && (
					<View style={styles.inputWrapper}>
						<Input
							style={styles.input}
							placeholder="Set a private party password"
							placeholderTextColor={'#969696FF'}
							value={passwordValue}
							onChangeText={(text) => {
								setPasswordValue(text)
							}}
						/>
					</View>
				)}
			</View>
			{/* confirm */}
			<View style={styles.confirm}>
				<Pressable onPress={confirmHandle} style={[styles.confirmButton]}>
					<Text style={{ fontSize: 18, fontWeight: 500, color: '#FFFFFFFF' }}>Confirm</Text>
				</Pressable>
			</View>
			<LanguageBottomSheet
				ref={languageBottomSheetRef}
				onSelect={selectLanguageHandle}
				closeHandle={() => languageBottomSheetRef.current?.close()}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	absolute: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	header: {
		height: 44,
		position: 'relative',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 6
	},
	backIcon: {
		position: 'absolute',
		left: 16,
		top: 10
	},
	headerText: {
		fontSize: 20,
		fontWeight: 500,
		color: '#1C002D'
	},
	labelText: {
		fontSize: 17,
		color: '#1C002D'
	},
	language: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 16
	},
	theme: {
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 20
	},
	inputWrapper: {
		width: 343,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#F5F5F5FF',
		marginTop: 16,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	input: {
		width: 323,
		fontSize: 14,
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 0,
		borderColor: 'transparent',
		color: '#1C002DFF'
	},
	cover: {
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 20
	},
	coverImage: {
		width: 90,
		height: 90,
		objectFit: 'cover'
	},
	imageContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		width: 90,
		height: 90,
		borderRadius: 10,
		backgroundColor: '#f5f5f5FF'
	},
	label: {
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 20
	},
	labelContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		gap: 25
	},
	labelItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 5,
		width: 60,
		height: 23,
		borderRadius: 11,
		backgroundColor: '#f5f5f5FF'
	},
	password: {
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 21
	},
	confirm: {
		position: 'absolute',
		left: 0,
		bottom: 26,
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 16,
		paddingRight: 16
	},
	confirmButton: {
		width: 343,
		height: 52,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 26,
		backgroundColor: '#66a3feFF'
	}
})

export default PartySetter

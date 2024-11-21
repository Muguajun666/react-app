import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from '../../components/Icon'
import { Input } from '../../components/ui/input'
import { addOrEditAddressApi } from '../../services/api/address'
import { LISTENER } from '../../components/Toast'
import EventEmitter from '../../utils/emitter'

export type AddressSetterProps = {
	closeHandle: () => void
	refreshHandle: () => void
	type: 'Add' | 'Edit'
	params: {
		id?: number
		name?: string
		address?: string
		phone?: string
	}
}

const AddressSetter = (props: AddressSetterProps): React.JSX.Element => {
	const { params, type, closeHandle, refreshHandle } = props

	const { name, address, phone, id } = params

	useEffect(() => {
		if (type === 'Edit') {
			setNameValue(name!)
			setAddressValue(address!)
			setPhoneValue(phone!)
		}
	}, [])

	const [nameValue, setNameValue] = useState<string>('')

	const [addressValue, setAddressValue] = useState<string>('')

	const [phoneValue, setPhoneValue] = useState<string>('')

	const backHandle = () => {
		closeHandle()
	}

	const confirmHandle = async () => {
		if (!nameValue) {
			EventEmitter.emit(LISTENER, { message: 'Please enter your name!' })
			return
		}

		if (!addressValue) {
			EventEmitter.emit(LISTENER, { message: 'Please enter your address!' })
			return
		}

		if (!phoneValue) {
			EventEmitter.emit(LISTENER, { message: 'Please enter your phone!' })
			return
		}

		const params: any = {
			receiver: nameValue,
			address: addressValue,
			telephone: phoneValue
		}

		if (type === 'Edit') {
			params.id = id!
		}

		const res: any = await addOrEditAddressApi(params)

		if (res.success) {
			EventEmitter.emit(LISTENER, {
				message: type === 'Add' ? 'Add address success !' : 'Edit address success !'
			})
			closeHandle()
			refreshHandle()
		} else {
			EventEmitter.emit(LISTENER, {
				message: type === 'Add' ? 'Add address failed !' : 'Edit address failed !'
			})
		}
	}

	return (
		<View className="w-full h-full absolute top-0 left-0 bottom-0 right-0">
			{/* header */}
			<View style={styles.header}>
				<Pressable onPress={backHandle} style={styles.backIcon}>
					<Icon iconFamily="AntDesign" name="left" size={25} color="#000" />
				</Pressable>
				<Text style={styles.headerText}>{`${type} address`}</Text>
			</View>
			{/* form-data */}
			<View style={styles.formContainer}>
				<View style={[styles.formItem, { borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }]}>
					<Text style={styles.label}>Name: </Text>
					<Input
						style={styles.input}
						value={nameValue}
						onChangeText={(text) => {
							setNameValue(text)
						}}
					/>
				</View>
				<View style={[styles.formItem, { borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }]}>
					<Text style={styles.label}>Address: </Text>
					<Input
						style={styles.input}
						value={addressValue}
						onChangeText={(text) => {
							setAddressValue(text)
						}}
					/>
				</View>
				<View style={styles.formItem}>
					<Text style={styles.label}>Phone: </Text>
					<Input
						style={styles.input}
						value={phoneValue}
						onChangeText={(text) => {
							setPhoneValue(text)
						}}
					/>
				</View>
			</View>
			{/* confirm-address */}
			<View style={styles.confirm}>
				<Pressable onPress={confirmHandle} style={[styles.confirmButton]}>
					<Text style={{ fontSize: 18, fontWeight: 500, color: '#FFFFFFFF' }}>Confirm</Text>
				</Pressable>
			</View>
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
		backgroundColor: '#B34EFAFF'
	},
	formContainer: {
		height: '100%',
		backgroundColor: '#f3f3f3FF'
	},
	formItem: {
		height: 50,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#fff'
	},
	label: {
		fontSize: 14,
		color: '#999999'
	},
	input: {
		width: 300,
		fontSize: 15,
		paddingTop: 2,
		paddingBottom: 0,
		paddingLeft: 0,
		borderColor: 'transparent',
		color: '#000000FF'
	}
})

export default AddressSetter

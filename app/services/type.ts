import { AxiosResponse } from 'axios'

export interface IResponse<T> extends AxiosResponse {
	code: string
	extParams: string | null
	message: string | null
	object: T
	redirect: string | null
	success: boolean
}

export interface ILoginParams {
	code?: string
	credential?: string
	email?: string
	loginType?: string
	password?: string
	accessToken?: string
	accessTokenSecret?: string
	phoneMac?: string
}

export interface IGetRoomListParams {
	id?: number
	label?: number
	pageNum?: number
	pageSize?: number
	subject?: string
}

export interface IJoinRoomParams {
	id: number
	password?: string
}

export interface IGetRtcTokenParams {
	roomId: string
}

export interface ICreateRoomParams {
	coverImg: string
	id?: number
	isPrivate?: boolean
	label?: number
	language: string
	password?: string
	subject: string
}

export interface IAddOrEditAddressParams {
	address: string
	id?: number
	receiver: string
	telephone: string
}

export interface IApplyOrderParams {
	id: number
	address?: string
	orderRemark?: string
	receiver?: string
	telephone?: string
}

export type TRoomListItem = {
	aliRoomId?: string
	coverImg?: string | null
	createUser?: number
	heatValue?: number | null
	id?: number
	isPrivate?: boolean
	label?: number
	language?: string
	onlineAmount?: number | null
	password?: string | null
	subject?: string
	userRespDTOList?: TRoomUserDTO[]
}

export type TRoomUserDTO = {
	avatar: string | null
	gender: number
	heatValue: number
	isFriend: boolean
	nickName: string
	userId: number
	joinTime?: number | null
	calTimes?: number | null
	micIndex?: number
}

export type RtcTokenObject = {
	appId: string
	rtcToken: string
	timestamp: string
}

export type ImTokenObject = {
	appId: string
	appSign: string
	appToken: string
	nonce: string
	role: string
	timestamp: string
	userId: string
}

export type TAddressList = {
	address: string
	id: number
	isDefault: boolean
	receiver: string
	telephone: string
}

export type TOrderList = {
	id: string
	goodsId: number
	categoryId: number
	categoryName: string | null
	categoryImg: string | null
	goodsName: string
	goodsImg: string
	goodsPrice: number
	integralPrice: number
	recycleIntegralPrice: number
	isVirtual: boolean
	msgType: string | null
	orderStatus: string
	orderDesc: string | null
	orderRemark: string | null
	expressCompany: string | null
	expressNo: string | null
	orderRefusedReason: string | null
}

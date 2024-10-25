import { AxiosResponse } from 'axios'

export interface IResponse extends AxiosResponse {
	code: string
	extParams: string | null
	message: string | null
	object: any
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

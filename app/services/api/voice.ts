import request from '../request'
import { APP_API_PREFIX } from '@env'
import { ICreateRoomParams, IGetRoomListParams, IGetRtcTokenParams, IJoinRoomParams } from '../type'

export const getRoomListApi = (params: IGetRoomListParams) => {
	return request.get(APP_API_PREFIX + 'voiceRoom/page', { params })
}

export const joinRoomApi = (params: IJoinRoomParams) => {
	return request.post(APP_API_PREFIX + 'voiceRoom/join', params)
}

export const getRtcTokenApi = (params: IGetRtcTokenParams) => {
	return request.get(APP_API_PREFIX + 'voiceRoom/rtcToken', { params })
}

export const getImTokenApi = () => {
	return request.get(APP_API_PREFIX + 'voiceRoom/imToken')
}

export const createOrSetRoomApi = (params: ICreateRoomParams) => {
	return request.post(APP_API_PREFIX + 'voiceRoom', params)
}
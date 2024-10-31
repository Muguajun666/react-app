import request from '../request'
import { APP_API_PREFIX } from '@env'
import { IGetRoomListParams, IGetRtcTokenParams, IJoinRoomParams } from '../type'

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

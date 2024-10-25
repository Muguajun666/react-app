import request from '../request'
import { APP_API_PREFIX } from '@env'
import { IGetRoomListParams } from '../type'

export const getRoomListApi = (params: IGetRoomListParams) => {
	return request.get(APP_API_PREFIX + 'voiceRoom/page', { params })
}

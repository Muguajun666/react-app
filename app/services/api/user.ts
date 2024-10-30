import request from '../request'
import { APP_API_PREFIX } from '@env'
import { ILoginParams } from '../type'

export const loginApi = (params: ILoginParams) => {
	return request.post(APP_API_PREFIX + 'user/login', params)
}

export const getUserInfoApi = () => {
	return request.get(APP_API_PREFIX + 'user/getInfo')
}

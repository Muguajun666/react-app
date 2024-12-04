import request from '../request'
import { APP_API_PREFIX } from '@env'

export const checkFriendApi = (userIds : string) => {
	return request.get(APP_API_PREFIX + `friend/check/${userIds}`)
}
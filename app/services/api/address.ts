import request from '../request'
import { APP_API_PREFIX } from '@env'
import { IAddOrEditAddressParams } from '../type'

export const getReceiveAddressApi = (paramsStr : string) => {
	return request.get(APP_API_PREFIX + `receiveAddress${paramsStr}`)
}

export const addOrEditAddressApi = (params : IAddOrEditAddressParams) => {
	return request.post(APP_API_PREFIX + 'receiveAddress', params)
}

export const deleteAddressApi = (id : number) => {
	return request.post(APP_API_PREFIX + `receiveAddress/del/${id}`)
}

export const setDefaultAddressApi = (id : number) => {
	return request.post(APP_API_PREFIX + `receiveAddress/changeDefault/${id}`)
}
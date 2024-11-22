import request from '../request'
import { APP_API_PREFIX } from '@env'
import { IApplyOrderParams } from '../type'

export const getOrderApi = (paramsStr : string) => {
	return request.get(APP_API_PREFIX + `order/page${paramsStr}`)
}

export const recycleOrderApi = (id : string) => {
  return request.post(APP_API_PREFIX + `order/recycle/${id}`)
}

export const applyOrderApi = (params : IApplyOrderParams) => {
  return request.post(APP_API_PREFIX + `order`, params)
}
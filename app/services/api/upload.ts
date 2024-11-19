import request from '../request'
import { APP_API_PREFIX } from '@env'

export function uploadApi(params: { uploadUrl: string; file: File | Blob; contentType: string }) {
	const { uploadUrl, file, contentType } = params
	return request({
		method: 'PUT',
		url: uploadUrl,
		data: file,
		headers: {
			'Content-Type': contentType
		},
		withCredentials: false
	})
}

export const getUploadTempAuthUrl = (params: any) => {
	return request.post(APP_API_PREFIX + 'common/file/getUploadTempAuthUrl', params)
}

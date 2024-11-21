import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// 对象参数转GET方法所需字符串
export function paramsToGetParamsStr(params: Object) {
	const entries = Object.entries(params)
	return entries.reduce((pre, cur, index) => {
		const [key, value] = cur
		if (index === 0) {
			pre += `?${key}=${value}`
		} else {
			pre += `&${key}=${value}`
		}
		return pre
	}, '')
}
export interface UserInfo {
	userName?: string
	avatar?: string
}

export interface SeatInfo {
	isLocked?: boolean
	isMuted?: boolean
	isUsed?: boolean
	seatNumber?: number
	userInfo?: UserInfo
}

export type TMessage = {
	id?: string
	type?: 'system' | 'user'
	content?: string
	userName?: string
	avatar?: string
}

export type TGameInfo = {
	name?: string
	entry?: string
	icon?: string
}

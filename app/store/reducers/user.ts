import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface UserState {
	email?: string
	nickName?: string
	avatar?: string
	gender?: number
	integral?: number
	strength?: number
	id?: number
}

const UserSlice = createSlice({
	name: 'user',
	initialState: {
		userInfo: {} as UserState
	},
	reducers: {
		setUser(state, action: PayloadAction<{ userInfo: UserState }>) {
			const { userInfo } = action.payload
			state.userInfo = userInfo
		},
		clearUser(state) {
			state.userInfo = {}
		}
	}
})

export const { setUser, clearUser } = UserSlice.actions

export default UserSlice.reducer

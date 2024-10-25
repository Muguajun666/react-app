import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface UserState {
	email: string | null
	nickName: string
	avatar: string | null
	gender: number
	integral: number
	strength: number
	id: number
}

const UserSlice = createSlice({
	name: 'user',
	initialState: {
		email: null,
		nickName: '',
		avatar: null,
		gender: 0,
		integral: 0,
		strength: 0,
		id: 0
	} as UserState,
	reducers: {
		setUser(state, action: PayloadAction<UserState>) {
			const { email, nickName, avatar, gender, integral, strength, id } = action.payload
			state.email = email
			state.nickName = nickName
			state.avatar = avatar
			state.gender = gender
			state.integral = integral
			state.strength = strength
			state.id = id
		},
		clearUser(state) {
			state.email = null
			state.nickName = ''
			state.avatar = null
			state.gender = 0
			state.integral = 0
			state.strength = 0
			state.id = 0
		}
	}
})

export const { setUser, clearUser } = UserSlice.actions

export default UserSlice.reducer

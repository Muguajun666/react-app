import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface AppState {
	token: string
	language: string
}

const AppSlice = createSlice({
	name: 'app',
	initialState: {
		token: '',
		language: 'en-US'
	} as AppState,
	reducers: {
		setToken: (state, action: PayloadAction<{ token: string }>) => {
			const { token } = action.payload
			state.token = token
		},
		setLanguage: (state, action: PayloadAction<{ language: string }>) => {
			const { language } = action.payload
			state.language = language
		},
		clearToken: (state) => {
			state.token = ''
		}
	}
})

export const { setToken, setLanguage, clearToken } = AppSlice.actions

export default AppSlice.reducer

import app from './app'
import user from './user'

import { combineReducers } from '@reduxjs/toolkit'

export default combineReducers({
	app,
	user
})

import { createStore, combineReducers } from 'redux'

import dashboardsReducer from './dashboardsReducer.js'

export const store = createStore(combineReducers({
	dashboards: dashboardsReducer
}))
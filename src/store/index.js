import { createStore, combineReducers } from 'redux'

import dashboardsReducer from './dashboardsReducer.js'
import userReducer from './userReducer.js'

export const store = createStore(combineReducers({
	dashboards: dashboardsReducer,
	user: userReducer
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
import { createStore, combineReducers } from 'redux'

import dashboardsReducer from './dashboardsReducer.js'
import listsReducer from './listsReducer.js'
import tasksReducer from './tasksReducer.js'
import usersReducer from './usersReducer.js'
import userReducer from './userReducer.js'

export const store = createStore(combineReducers({
	dashboards: dashboardsReducer,
	lists: listsReducer,
	tasks: tasksReducer,
	users: usersReducer,
	user: userReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

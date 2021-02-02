export default function userReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	switch(action.type) {
		case 'setLoggedIn': {
			newState.loggedIn = action.value
			newState.name = action.username
			newState.id = action.id

			break
		} case 'clearAllStates': {
			return {}
		}
	}

	return newState
}

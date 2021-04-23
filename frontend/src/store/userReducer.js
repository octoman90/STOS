export default function userReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	switch(action.type) {
		case 'setLoggedIn': {
			newState.loggedIn = true
			newState.name = action.username
			newState.id = action.id

			return newState
		} case 'clearAllStates': {
			return {}
		} default: {
			return newState
		}
	}
}

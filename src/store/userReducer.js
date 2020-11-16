export default function userReducer(state = {}, action) {
	switch(action.type) {
		case 'setLoggedIn':
			const newState = JSON.parse(JSON.stringify(state))
			newState.loggedId = action.value
			newState.username = action.username
			
			return newState

		default:
			return state

	}
}
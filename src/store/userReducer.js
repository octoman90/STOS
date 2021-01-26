export default function userReducer(state = {}, action) {
	switch(action.type) {
		case 'setLoggedIn':
			const newState = JSON.parse(JSON.stringify(state))
			newState.loggedIn = action.value
			newState.username = action.username
			newState.id = action.id
			
			return newState

		default:
			return state

	}
}

export default function usersReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	switch (action.type) {
		case 'setUsers': {
			action.users.forEach(user => {
				newState[user.id] = user
			})

			return newState
		} case 'setUser': {
			newState[action.user.id] = action.user

			return newState
		} case 'deleteUser': {
			delete newState[action.userID]

			return newState
		} case 'clearAllStates': {
			return {}
		} default: {
			return newState
		}
	}
}

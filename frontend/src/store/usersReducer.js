export default function usersReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	// eslint-disable-next-line
	switch (action.type) {
		case 'setUsers': {
			action.users.forEach(user => {
				newState[user.id] = user
			})

			break
		} case 'setUser': {
			newState[action.user.id] = action.user

			break
		} case 'deleteUser': {
			delete newState[action.userID]

			break
		} case 'clearAllStates': {
			return {}
		}
	}

	return newState
}

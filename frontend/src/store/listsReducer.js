export default function listsReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	switch (action.type) {
		case 'setLists': {
			action.lists.forEach(list => {
				newState[list.id] = list
			})

			return newState
		} case 'setList': {
			newState[action.list.id] = action.list

			return newState
		} case 'deleteList': {
			delete newState[action.listID]

			return newState
		} case 'clearAllStates': {
			return {}
		} default: {
			return newState
		}
	}
}

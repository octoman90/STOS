export default function listsReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	// eslint-disable-next-line
	switch (action.type) {
		case 'setLists': {
			action.lists.forEach(list => {
				newState[list.id] = list
			})

			break
		} case 'setList': {
			newState[action.list.id] = action.list

			break
		} case 'deleteList': {
			delete newState[action.listID]

			break
		} case 'clearAllStates': {
			return {}
		}
	}

	return newState
}

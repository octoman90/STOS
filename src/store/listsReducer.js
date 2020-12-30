export default function listsReducer(state = [], action) {
	const newState = JSON.parse(JSON.stringify(state))

	// eslint-disable-next-line
	switch (action.type) {
		case 'setLists': {
			action.lists.forEach(list => {
				let index = state.findIndex(ogList => ogList.id == list.id)

				if (index > -1) {
					newState[index] = list
				} else {
					newState.push(list)
				}
			})

			break
		} case 'setList': {
			let index = state.findIndex(ogList => ogList.id == action.list.id)

			if (index > -1) {
				newState[index] = action.list
			} else {
				newState.push(action.list)
			}

			break
		}
	}

	return newState
}

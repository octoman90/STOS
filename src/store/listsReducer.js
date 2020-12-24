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
		}
	}

	// if (action.type === 'createTask') {
	// 	let { listId, newTaskId } = action
	// 	newState[listId].taskIds.push(newTaskId)
	// } else if (action.type === 'moveTask') {
	// 	let { taskId, source, destination } = action
			
	// 	newState[source.listId].taskIds.splice(source.index, 1)
	// 	newState[destination.listId].taskIds.splice(destination.index, 0, taskId)
	// }

	return newState
}

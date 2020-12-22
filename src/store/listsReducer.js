function upsyncList(data) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/syncList', options)
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default function listsReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	if (action.type === 'createList') {
		upsyncList({
			title: 'New List',
			dashboardID: action.dashboardId
		}).then(newList => {
			newState[newList.id] = newList
		})
	} else if (action.type === 'createTask') {
		let { listId, newTaskId } = action
		newState[listId].taskIds.push(newTaskId)
	} else if (action.type === 'moveTask') {
		let { taskId, source, destination } = action
			
		newState[source.listId].taskIds.splice(source.index, 1)
		newState[destination.listId].taskIds.splice(destination.index, 0, taskId)
	}

	return newState
}

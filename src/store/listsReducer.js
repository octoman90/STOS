let defaultState = {  // Temporary
	'list0': {
		id: 'list0',
		title: 'List with id 0',
		taskIds: ['task0', 'task1']
	},
	
	'list1': {
		id: 'list1',
		title: 'List with id 1',
		taskIds: ['task2', 'task3']
	},

	'list2': {
		id: 'list2',
		title: 'List with id 2',
		taskIds: ['task4', 'task5'] 
	},
}

export default function listsReducer(state = defaultState, action) {
	const newState = JSON.parse(JSON.stringify(state))

	if (action.type === 'createList') {
		let { newListId } = action

		newState[newListId] = {
			id: newListId,
			title: 'New List',
			taskIds: []
		}
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
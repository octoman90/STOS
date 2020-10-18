let defaultState = {  // Temporary
	'dashboard0': {
		tasks: {
			'task0': { id: 'task0', title: 'Task with id 0' },
			'task1': { id: 'task1', title: 'Task with id 1' },
			'task2': { id: 'task2', title: 'Task with id 2' },
			'task3': { id: 'task3', title: 'Task with id 3' },
		},

		lists: {
			'list0': { id: 'list0', title: 'List with id 0', taskIds: ['task0', 'task1'] },
			'list1': { id: 'list1', title: 'List with id 1', taskIds: ['task2', 'task3'] },
		},

		listIds: ['list0', 'list1']
	}
}

export default function dashboardsReducer(state = defaultState, action) {
	switch(action.type) {
		case 'moveTask':
			const { dashboardId, taskId, source, destination } = action
			const newState = JSON.parse(JSON.stringify(state))
			
			newState[dashboardId].lists[source.listId].taskIds.splice(source.index, 1)
			newState[dashboardId].lists[destination.listId].taskIds.splice(destination.index, 0, taskId)
			
			return newState

		default:
			return state

	}
}
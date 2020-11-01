let defaultState = {  // Temporary
	'dashboard0': {
		title: 'Dashboard #0',
		id: 'dashboard0',

		tasks: {
			'task0': { id: 'task0', title: 'Task with id 0', modules: [{type: 'description', content: 'Hello world'}, {type: 'tagList', content: ['red', 'important']}] },
			'task1': { id: 'task1', title: 'Task with id 1', modules: [] },
			'task2': { id: 'task2', title: 'Task with id 2', modules: [{type: 'tagList', content: ['blue']}] },
			'task3': { id: 'task3', title: 'Task with id 3', modules: [{type: 'description', content: 'Hello'}, {type: 'description', content: 'world'}] },
		},

		lists: {
			'list0': { id: 'list0', title: 'List with id 0', taskIds: ['task0', 'task1'] },
			'list1': { id: 'list1', title: 'List with id 1', taskIds: ['task2', 'task3'] },
		},

		listIds: ['list0', 'list1']
	},

	'dashboard1': {
		title: 'Dashboard #1',
		id: 'dashboard1',

		tasks: {
			'task4': { id: 'task4', title: 'Task with id 4', modules: [] },
			'task5': { id: 'task5', title: 'Task with id 5', modules: [] },
		},

		lists: {
			'list2': { id: 'list2', title: 'List with id 2', taskIds: ['task4', 'task5'] },
		},

		listIds: ['list2']
	}
}

export default function dashboardsReducer(state = defaultState, action) {
	const newState = JSON.parse(JSON.stringify(state))

	if (action.type === 'createDashboard') {
		let newDashboardId = `newDashboard${+new Date()}`

		newState[newDashboardId] = {
			id: newDashboardId,
			title: 'New Dashboard',
			tasks: {},
			lists: {},
			listIds: []
		}
	} else if (action.type === 'createList') {
		let { dashboardId } = action
		let newListId = `newList${+new Date()}`

		newState[dashboardId].listIds.push(newListId)
		newState[dashboardId].lists[newListId] = {
			id: newListId,
			title: 'New List',
			taskIds: []
		}
	} else if (action.type === 'createTask') {
		let { dashboardId, listId } = action
		console.log(dashboardId, listId)
		let newTaskId = `newTask${+new Date()}`

		newState[dashboardId].lists[listId].taskIds.push(newTaskId)
		newState[dashboardId].tasks[newTaskId] = {
			id: newTaskId,
			title: 'New Task',
			modules: []
		}
	} else if (action.type === 'moveTask') {
		let { dashboardId, taskId, source, destination } = action
			
		newState[dashboardId].lists[source.listId].taskIds.splice(source.index, 1)
		newState[dashboardId].lists[destination.listId].taskIds.splice(destination.index, 0, taskId)
	}

	return newState
}
let defaultState = {  // Temporary
	'task0': {
		id: 'task0',
		title: 'Task with id 0',
		modules: [
			{
				type: 'description',
				content: 'Hello world'
			},

			{
				type: 'tagList',
				content: ['red', 'important']
			}
		] 
	},

	'task1': {
		id: 'task1',
		title: 'Task with id 1',
		modules: []
	},

	'task2': {
		id: 'task2',
		title: 'Task with id 2',
		modules: [
			{
				type: 'tagList',
				content: ['blue']
			}
		]
	},

	'task3': {
		id: 'task3',
		title: 'Task with id 3',
		modules: [
			{
				type: 'description',
				content: 'Hello'
			},

			{
				type: 'description',
				content: 'world'
			}
		]
	},

	'task4': {
		id: 'task4',
		title: 'Task with id 4',
		modules: []
	},

	'task5': {
		id: 'task5',
		title: 'Task with id 5',
		modules: []
	},
}

export default function tasksReducer(state = defaultState, action) {
	if (action.type === 'createTask') {
		const newState = JSON.parse(JSON.stringify(state))

		let { newTaskId } = action

		newState[newTaskId] = {
			id: newTaskId,
			title: 'New Task',
			modules: []
		}

		return newState
	}

	return state
}
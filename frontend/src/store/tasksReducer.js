export default function tasksReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	switch (action.type) {
		case 'setTasks': {
			action.tasks.forEach(task => {
				newState[task.id] = task
			})

			return newState
		} case 'setTask': {
			newState[action.task.id] = action.task

			return newState
		} case 'deleteTask': {
			delete newState[action.taskID]

			return newState
		} case 'clearAllStates': {
			return {}
		} default: {
			return newState
		}
	}
}

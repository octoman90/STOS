export default function tasksReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	// eslint-disable-next-line
	switch (action.type) {
		case 'setTasks': {
			action.tasks.forEach(task => {
				newState[task.id] = task
			})

			break
		} case 'setTask': {
			newState[action.task.id] = action.task

			break
		} case 'deleteTask': {
			delete newState[action.taskID]
			break
		} case 'clearAllStates': {
			return {}
		}
	}

	return newState
}

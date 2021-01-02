export default function tasksReducer(state = {}, action) {
	const patch = {}

	// eslint-disable-next-line
	switch (action.type) {
		case 'setTasks': {
			action.tasks.forEach(task => {
				patch[task.id] = task
			})

			break
		} case 'setTask': {
			patch[action.task.id] = action.task

			break
		}
	}

	return { ...state, ...patch }
}

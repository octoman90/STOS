export default function tasksReducer(state = [], action) {
	const newState = JSON.parse(JSON.stringify(state))

	// eslint-disable-next-line
	switch (action.type) {
		case 'setTasks': {
			action.tasks.forEach(task => {
				let index = state.findIndex(ogTask => ogTask.id == task.id)

				if (index > -1) {
					newState[index] = task
				} else {
					newState.push(task)
				}
			})

			break
		} case 'setTask': {
			let index = state.findIndex(ogTask => ogTask.id == action.task.id)

			if (index > -1) {
				newState[index] = action.task
			} else {
				newState.push(action.task)
			}

			break
		}
	}

	return newState
}

function getMaxIndex(tasksObject, listID) {
	let sorted = Object.values(tasksObject).filter(task => task.list === listID).sort((a, b) => b.index - a.index)
	return sorted.length ? sorted[0].index : -1
}

function getID(tasksObject, listID, index) {
	return Object.values(tasksObject).find(task => task.list === listID && task.index === index).id
}

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
		} case 'moveTask': {
			newState[action.taskID].index = null
			newState[action.taskID].list = null

			if (action.source.listID == action.destination.listID) {
				if (action.source.index < action.destination.index) {
					for (let i = action.source.index + 1; i <= action.destination.index; ++i) {
						newState[getID(newState, action.source.listID, i)].index = i - 1
					}
				} else {
					for (let i = action.source.index - 1; i >= action.destination.index; --i) {
						newState[getID(newState, action.source.listID, i)].index = i + 1
					}
				}
			} else {
				let sMaxIndex = getMaxIndex(newState, action.source.listID)
				if (sMaxIndex >= 0) {
					for (let i = action.source.index + 1; i <= sMaxIndex; ++i) {
						newState[getID(newState, action.source.listID, i)].index = i - 1
					}
				}

				let dMaxIndex = getMaxIndex(newState, action.destination.listID)
				if (dMaxIndex >= 0) {
					for (let i = dMaxIndex; i >= action.destination.index; --i) {
						newState[getID(newState, action.destination.listID, i)].index = i + 1
					}
				}
			}

			newState[action.taskID].index = action.destination.index
			newState[action.taskID].list = action.destination.listID

			break
		}
	}

	return newState
}

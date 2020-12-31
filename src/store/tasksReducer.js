function getMaxIndex(taskArray, listID) {
	let sorted = taskArray.filter(task => task.list === listID).sort((a, b) => b.index - a.index)
	return sorted.length ? sorted[0].index : -1
}

function changeIndex(taskArray, sListID, dListID, sIndex, dIndex) {
	let i = taskArray.findIndex(task => task.list === sListID && task.index === sIndex)
	taskArray[i].index = dIndex
	taskArray[i].list = dListID

	return taskArray
}

export default function tasksReducer(state = [], action) {
	let newState = JSON.parse(JSON.stringify(state))

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
		} case 'moveTask': {
			newState = changeIndex(newState, action.source.listID, null, action.source.index, null)

			if (action.source.listID == action.destination.listID) {
				if (action.source.index < action.destination.index) {
					for (let i = action.source.index + 1; i <= action.destination.index; ++i) {
						newState = changeIndex(newState, action.source.listID, action.source.listID, i, i - 1)
					}
				} else {
					for (let i = action.source.index - 1; i >= action.destination.index; --i) {
						newState = changeIndex(newState, action.source.listID, action.source.listID, i, i + 1)
					}
				}
			} else {
				let sMaxIndex = getMaxIndex(newState, action.source.listID)
				if (sMaxIndex >= 0) {
					for (let i = action.source.index + 1; i <= sMaxIndex; ++i) {
						newState = changeIndex(newState, action.source.listID, action.source.listID, i, i - 1)
					}
				}

				let dMaxIndex = getMaxIndex(newState, action.destination.listID)
				if (dMaxIndex >= 0) {
					for (let i = getMaxIndex(newState, action.destination.listID); i >= action.destination.index; --i) {
						newState = changeIndex(newState, action.destination.listID, action.destination.listID, i, i + 1)
					}
				}
			}

			newState = changeIndex(newState, null, action.destination.listID, null, action.destination.index)

			break
		}
	}

	return newState
}

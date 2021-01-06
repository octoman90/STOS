export function upsyncTask(data, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/task', options)
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setTask',
				task: data || {}
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default {
	upsyncMany: (tasks, dispatch) => {
		let options = {
			method: "POST",
			body: JSON.stringify(tasks)
		}

		return fetch('/api/tasks', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				dispatch({
					type: 'setTasks',
					tasks: data || []
				})
			})
			.catch(err => {
				console.log('error', err.message)
			})
	},

	downsyncMany: (listID, dispatch) => {
		fetch('/api/tasks?' + new URLSearchParams({ listID }))
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				dispatch({
					type: 'setTasks',
					tasks: data || []
				})
			})
			.catch(err => {
				console.log('error', err.message)
			})
	},

	deleteOne: (task, dispatch) => {
		let options = {
			method: "delete",
			body: JSON.stringify(task)
		}

		fetch('/api/task', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				dispatch({
					type: 'deleteTask',
					taskID: task.id
				})
			})
			.catch(err => {
				console.log('error', err.message)
			})
	}
}

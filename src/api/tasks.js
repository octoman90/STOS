export function upsyncTask(data, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/syncTask', options)
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
	deleteOne: (task, dispatch) => {
		let options = {
			method: "delete",
			body: JSON.stringify(task)
		}

		fetch('/api/syncTask', options)
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
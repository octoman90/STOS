export default {
	createOne: task => {
		let options = {
			method: 'POST',
			body: JSON.stringify(task)
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
				if (data === null){
					return {}
				} else if (!('ok' in data) || data.ok) {
					return data
				} else {
					throw new Error(data.message)
				}
			})
	},

	readMany: (listID, dispatch) => {
		return fetch('/api/task?' + new URLSearchParams({ listID }))
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				if (data === null){
					return []
				} else if (!('ok' in data) || data.ok) {
					return data
				} else {
					throw new Error(data.message)
				}
			})
	},

	updateOne: task => {
		let options = {
			method: 'UPDATE',
			body: JSON.stringify([task])
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
				if (data === null){
					return {}
				} else if (!('ok' in data) || data.ok) {
					return data[0]
				} else {
					throw new Error(data.message)
				}
			})
	},

	updateMany: (tasks, dispatch) => {
		let options = {
			method: 'UPDATE',
			body: JSON.stringify(tasks)
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
				if (data === null){
					return []
				} else if (!('ok' in data) || data.ok) {
					return data
				} else {
					throw new Error(data.message)
				}
			})
	},

	deleteOne: task => {
		let options = {
			method: 'DELETE',
			body: JSON.stringify(task)
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
				if (!('ok' in data) || data.ok) {
					return data
				} else {
					throw new Error(data.message)
				}
			})
	}
}

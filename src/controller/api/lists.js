export default {
	createOne: list => {
		let options = {
			method: "POST",
			body: JSON.stringify(list)
		}

		return fetch('/api/list', options)
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
	},

	readMany: dashboardID => {
		return fetch('/api/list?' + new URLSearchParams({ dashboardID }))
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

	updateOne: list => {
		let options = {
			method: "UPDATE",
			body: JSON.stringify(list)
		}

		return fetch('/api/list', options)
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
	},

	deleteOne: (list, dispatch) => {
		let options = {
			method: "delete",
			body: JSON.stringify(list)
		}

		fetch('/api/list', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				dispatch({
					type: 'deleteList',
					listID: list.id
				})
			})
			.catch(err => {
				console.log('error', err.message)
			})
	}
}

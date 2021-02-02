export default {
	createOne: (dashboard) => {
		let options = {
			method: "POST",
			body: JSON.stringify(dashboard)
		}

		return fetch('/api/dashboard', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
	},

	downsyncOne: (id) => {
		return fetch('/api/dashboard?' + new URLSearchParams({ id }))
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

	downsyncMany: () => {
		return fetch('/api/dashboard')
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

	updateOne: (dashboard) => {
		let options = {
			method: "UPDATE",
			body: JSON.stringify(dashboard)
		}

		return fetch('/api/dashboard', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
	},

	deleteOne: (dashboard, dispatch) => {
		let options = {
			method: "delete",
			body: JSON.stringify(dashboard)
		}

		fetch('/api/dashboard', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				dispatch({
					type: 'deleteDashboard',
					dashboardID: dashboard.id
				})
			})
			.catch(err => {
				console.log('error', err.message)
			})
	}
}

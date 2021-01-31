export function downsyncDashboards(dispatch) {
	fetch('/api/dashboards')
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setDashboards',
				dashboards: data || []
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default {
	upsyncOne: (dashboard) => {
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

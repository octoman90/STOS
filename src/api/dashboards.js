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

export function downsyncDashboard(id, dispatch) {
	fetch('/api/dashboard?' + new URLSearchParams({ id }))
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setDashboard',
				dashboard: data || {}
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export function upsyncDashboard(dashboard, dispatch) {
	let options = {
		method: "POST",
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
				type: 'setDashboard',
				dashboard: data || {}
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default {
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

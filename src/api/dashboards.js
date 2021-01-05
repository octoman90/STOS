export function downsyncDashboards(dispatch) {
	fetch('/api/syncDashboards')
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
	fetch('/api/syncDashboard?' + new URLSearchParams({ id }))
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

	fetch('/api/syncDashboard', options)
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

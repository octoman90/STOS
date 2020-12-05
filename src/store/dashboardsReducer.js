function upsyncDashboard(data) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/syncDashboard', options)
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default function dashboardsReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	if (action.type === 'downsyncDashboards') {
		action.dashboards.forEach(dashboard => {
			newState[dashboard.id] = dashboard
		})
	} else if (action.type === 'createDashboard') {
		upsyncDashboard({
			title: 'New Dashboard'
		}).then(newDashboard => {
			newState[newDashboard.id] = newDashboard
		})
	} else if (action.type === 'createList') {
		let { dashboardId, newListId } = action

		newState[dashboardId].listIds.push(newListId)
	}

	return newState
}

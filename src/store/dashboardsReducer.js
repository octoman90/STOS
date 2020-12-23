export default function dashboardsReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	if (action.type === 'setDashboards') {
		action.dashboards.forEach(dashboard => {
			newState[dashboard.id] = dashboard
		})
	} else if (action.type === 'setDashboard') {
		newState[action.dashboard.id] = action.dashboard
	}

	return newState
}

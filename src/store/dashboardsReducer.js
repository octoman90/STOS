export default function dashboardsReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	// eslint-disable-next-line
	switch (action.type) {
		case 'setDashboards': {
			action.dashboards.forEach(dashboard => {
				newState[dashboard.id] = dashboard
			})

			break
		} case 'setDashboard': {
			newState[action.dashboard.id] = action.dashboard

			break
		} case 'deleteDashboard': {
			delete newState[action.dashboardID]
			break
		}
	}

	return newState
}

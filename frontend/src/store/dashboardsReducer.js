export default function dashboardsReducer(state = {}, action) {
	const newState = JSON.parse(JSON.stringify(state))

	switch (action.type) {
		case 'setDashboards': {
			action.dashboards.forEach(dashboard => {
				newState[dashboard.id] = dashboard
			})

			return newState
		} case 'setDashboard': {
			newState[action.dashboard.id] = action.dashboard

			return newState
		} case 'deleteDashboard': {
			delete newState[action.dashboardID]

			return newState
		} case 'clearAllStates': {
			return {}
		} default: {
			return newState
		}
	}
}

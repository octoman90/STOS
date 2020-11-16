let defaultState = {  // Temporary
	'dashboard0': {
		title: 'Dashboard #0',
		id: 'dashboard0',
		listIds: ['list0', 'list1']
	},

	'dashboard1': {
		title: 'Dashboard #1',
		id: 'dashboard1',
		listIds: ['list2']
	}
}

export default function dashboardsReducer(state = defaultState, action) {
	const newState = JSON.parse(JSON.stringify(state))

	if (action.type === 'createDashboard') {
		let { newDashboardId } = action

		newState[newDashboardId] = {
			id: newDashboardId,
			title: 'New Dashboard',
			listIds: []
		}
	} else if (action.type === 'createList') {
		let { dashboardId, newListId } = action

		newState[dashboardId].listIds.push(newListId)
	}

	return newState
}
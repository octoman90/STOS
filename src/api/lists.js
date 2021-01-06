export function upsyncList(data, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
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
			dispatch({
				type: 'setList',
				list: data || {}
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default {
	downsyncMany: (dashboardID, dispatch) => {
		fetch('/api/lists?' + new URLSearchParams({ dashboardID }))
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				dispatch({
					type: 'setLists',
					lists: data || []
				})
			})
			.catch(err => {
				console.log('error', err.message)
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

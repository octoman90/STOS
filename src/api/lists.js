export function upsyncList(data, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/syncList', options)
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
	deleteOne: (list, dispatch) => {
		let options = {
			method: "delete",
			body: JSON.stringify(list)
		}

		fetch('/api/syncList', options)
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

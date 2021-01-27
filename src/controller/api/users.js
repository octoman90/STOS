export default {
	downsyncOne: (username) => {
		return fetch('/api/user?' + new URLSearchParams({ username }))
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
	}
}

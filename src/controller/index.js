import { dispatch as busDispatch } from 'use-bus'

import listAPI, { 
	upsyncList 
} 						from './api/lists.js'
import taskAPI, {
	upsyncTask
} 						from './api/tasks.js'
import dashboardAPI, {
	downsyncDashboards
} 						from './api/dashboards.js'
import userAPI			from './api/users.js'

export default {
	signUp: function (formData, dispatch) {
		if (formData.username.length < 5) {
			console.log('username should be at least 5 characters long')
			return
		} else if (formData.password.length < 5) {
			console.log('password should be at least 5 characters long')
			return
		}

		if (formData.password !== formData.repeatPassword) {
			console.log('passwords don\'t match')
			return
		} else if (formData.accepted === false) {
			console.log('you need to accept')
			return
		}

		let options = {
			method: 'POST',
			body: JSON.stringify({
				username: formData.username,
				password: formData.password
			})
		}

		fetch('/api/signUp', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				if (data.ok) {
					dispatch({
						type: 'setLoggedIn',
						value: true,
						username: data.username,
						id: data.id
					})

					busDispatch({ type: 'loggedIn' })
				}
			})
			.catch(err => {
				console.log('error', err.message)
				setTimeout(() => this.logIn(formData, dispatch), 1e3);
			})
	},

	logIn: (formData, dispatch) => {
		if (formData.username.length < 5) {
			console.log('username should be at least 5 characters long')
			return
		} else if (formData.password.length < 5) {
			console.log('password should be at least 5 characters long')
			return
		}

		let options = {
			method: 'POST',
			body: JSON.stringify({
				username: formData.username,
				password: formData.password
			})
		}

		fetch('/api/logIn', options)
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				if (data.ok) {
					dispatch({
						type: 'setLoggedIn',
						value: true,
						username: data.username,
						id: data.id
					})

					busDispatch({ type: 'loggedIn' })
				}
			})
			.catch(err => {
				console.log('error', err.message)
			})
	},

	logOut: (dispatch) => {
		fetch('/api/logOut', { method: 'POST' })
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				if (data.ok) {
					dispatch({
						type: 'setLoggedIn',
						value: false,
						username: null,
						id: null
					})

					busDispatch({ type: 'loggedOut' })
				}
			})
			.catch(err => {
				console.log('error', err.message)
			})
	},

	moveTask: (state, taskID, source, destination, dispatch) => {
		const patch = [{
			...state[taskID],
			index: destination.index,
			list: destination.listID
		}]

		function getMaxIndex(listID) {
			let sorted = Object.values(state).filter(task => task.list === listID && task.id !== taskID).sort((a, b) => b.index - a.index)
			return sorted.length ? sorted[0].index : -1
		}

		function getID(listID, index) {
			return Object.values(state).find(task => task.list === listID && task.index === index).id
		}

		// eslint-disable-next-line
		if (source.listID == destination.listID) {
			if (source.index < destination.index) {
				for (let i = source.index + 1; i <= destination.index; ++i) {
					patch.push({
						...state[getID(source.listID, i)],
						index: i - 1
					})
				}
			} else {
				for (let i = source.index - 1; i >= destination.index; --i) {
					patch.push({
						...state[getID(source.listID, i)],
						index: i + 1
					})
				}
			}
		} else {
			let sMaxIndex = getMaxIndex(source.listID)
			if (sMaxIndex >= 0) {
				for (let i = source.index + 1; i <= sMaxIndex; ++i) {
					patch.push({
						...state[getID(source.listID, i)],
						index: i - 1
					})
				}
			}

			let dMaxIndex = getMaxIndex(destination.listID)
			if (dMaxIndex >= 0) {
				for (let i = dMaxIndex; i >= destination.index; --i) {
					patch.push({
						...state[getID(destination.listID, i)],
						index: i + 1
					})
				}
			}
		}

		dispatch({
			type: 'setTasks',
			tasks: patch
		})

		taskAPI.upsyncMany(patch, dispatch)
	},

	renameDashboard: (dashboard, value, dispatch) => {
		dashboard.title = value

		dispatch({
			type: 'setDashboard',
			dashboard
		})

		dashboardAPI.upsyncOne(dashboard)
			.then(dashboard => {
				dispatch({
					type: 'setDashboard',
					dashboard: dashboard || {}
				})
			})
			.catch(err => {
				// Ignore the error
			})
	},

	renameList: (list, value, dispatch) => {
		list.title = value

		dispatch({
			type: 'setList',
			list
		})

		upsyncList(list, dispatch)
	},

	renameTask: (task, value, dispatch) => {
		task.title = value

		dispatch({
			type: 'setTask',
			task
		})

		upsyncTask(task, dispatch)
	},

	downsyncDashboards,

	downsyncDashboard: (dashboardID, dispatch) => {
		dashboardAPI.downsyncOne(dashboardID)
			.then(data => {
				dispatch({
					type: 'setDashboard',
					dashboard: data || {}
				})

				let usersToFetch = [data.ownerID, ...(data.userIDs || [])]
				usersToFetch.forEach((userID) => {
					userAPI.downsyncOne(userID)
						.then((data) => {
							dispatch({
								type: 'setUser',
								user: data || {}
							})
						})
						.catch(err => {
							// ignore the error
						})
				})
			})
			.catch(err => {
				console.log('error?', err)
				// ignore the error
			})
	},

	deleteDashboard: (dashboard, dispatch) => {
		dashboardAPI.deleteOne(dashboard, dispatch)
	},

	deleteList: (list, dispatch) => {
		listAPI.deleteOne(list, dispatch)
	},

	createList: (dashboardID, index, dispatch) => {
		upsyncList({ title: "New List", dashboard: dashboardID, index }, dispatch)
	},

	downsyncTasks: (listID, dispatch) => {
		taskAPI.downsyncMany(listID, dispatch)
	},

	createTask: (listID, index, dispatch) => {
		upsyncTask({ title: "New Task", list: listID, index }, dispatch)
	},

	deleteTask: (task, dispatch) => {
		taskAPI.deleteOne(task, dispatch)
	},

	checkSession: (dispatch) => {
		fetch('/api/session')
			.then(response => {
				if (response.ok && response.status === 200) {
					return response.json()
				} else {
					throw new Error(response.statusText)
				}
			})
			.then(data => {
				if (data.ok) {
					dispatch({
						type: 'setLoggedIn',
						value: true,
						username: data.username,
						id: data.id
					})

					busDispatch({ type: 'loggedIn' })
				} else {
					dispatch({
						type: 'setLoggedIn',
						value: false,
						username: null,
						id: null
					})

					busDispatch({ type: 'loggedOut' })
				}
			})
			.catch(err => {
				console.log('error', err.message)
			})
	},

	downsyncManyLists: (dashboardID, dispatch) => {
		listAPI.downsyncMany(dashboardID, dispatch)
	},

	createDashboard: (dispatch) => {
		dashboardAPI.upsyncOne({title: 'New Dashboard'})
			.then(dashboard => {
				dispatch({
					type: 'setDashboard',
					dashboard: dashboard || {}
				})

				let listsToCreate = ['To Do', 'In Process', 'Done']
				listsToCreate.forEach((title) => {
					upsyncList({ title, dashboard: dashboard.id }, dispatch)
				})
			})
			.catch(err => {
				// Ignore the error
			})
	},

	addUserToDashboard: (dashboard, value, dispatch) => {
		userAPI.downsyncOne(null, value)
			.then(user => {
				dispatch({
					type: 'setUser',
					user: user || {}
				})

				if (!dashboard.userIDs) {
					dashboard.userIDs = []
				}

				if (!dashboard.userIDs.includes(user.id)) {
					dashboard.userIDs.push(user.id)

					dashboardAPI.upsyncOne(dashboard)
						.then(dashboard => {
							dispatch({
								type: 'setDashboard',
								dashboard: dashboard || {}
							})
						})
						.catch(err => {
							console.log(err)
						})
				}
			})
			.catch(err => {
				console.log(err)
			})
	},

	removeUserFromDashboard: (dashboard, userID, dispatch) => {
		if (!dashboard.userIDs || !dashboard.userIDs.includes(userID)) {
			return
		}

		let index = dashboard.userIDs.findIndex(id => id === userID)
		dashboard.userIDs.splice(index, 1)

		dashboardAPI.upsyncOne(dashboard)
			.then(dashboard => {
				dispatch({
					type: 'setDashboard',
					dashboard: dashboard || {}
				})
			})
			.catch(err => {
				console.log(err)
			})
	},

	setDashboardCollaborative: (dashboard, value, dispatch) => {
		dashboard.collaborative = value

		dashboardAPI.upsyncOne(dashboard)
			.then(dashboard => {
				dispatch({
					type: 'setDashboard',
					dashboard: dashboard || {}
				})
			})
			.catch(err => {
				console.log(err)
			})
	},

	addModule: (task, mType, dispatch) => {
		let m = {
			type: mType,
			id: (+new Date()).toString(16) + (Math.floor(Math.random() * 100)).toString(16),
			content: null
		}

		// eslint-disable-next-line
		if (mType == 'poll') {
			m.content = {
				title: 'Shall we move this feature to the next sprint?',
				voted: [],
				votes: [
					['yes', 0],
					['no', 0]
				]
			}
		}

		if (!task.modules) {
			task.modules = []
		}

		task.modules.push(JSON.stringify(m))

		dispatch({
			type: 'setTask',
			task
		})

		upsyncTask(task, dispatch)
	},

	deleteTaskModule: (task, id, dispatch) => {
		let index = task.modules.findIndex((json) => json.includes(id))
		task.modules.splice(index, 1)

		dispatch({
			type: 'setTask',
			task
		})

		upsyncTask(task, dispatch)
	},

	editTaskModule: (task, id, newContent, dispatch) => {
		let index = task.modules.findIndex((json) => json.includes(id))
		let module = JSON.parse(task.modules[index])

		// eslint-disable-next-line
		if (newContent.action == 'replace') {
			module.content = newContent.value

			task.modules[index] = JSON.stringify(module)

			dispatch({
				type: 'setTask',
				task
			})

			upsyncTask(task, dispatch)
		// eslint-disable-next-line
		} else if (newContent.action == 'push') {
			if (module.type == 'userList') {} {
				if (!module.content) {
					module.content = []
				}

				if (module.content.find((user) => user[1] === newContent.value) !== undefined) {
					return
				}

				userAPI.downsyncOne(null, newContent.value)
					.then(data => {
						module.content.push([data.id, data.name])
						return module
					})
					.then(module => {
						task.modules[index] = JSON.stringify(module)

						dispatch({
							type: 'setTask',
							task
						})

						upsyncTask(task, dispatch)
					})
					.catch(err => {
						// ignore the error
					})
			}
		}
	}
}

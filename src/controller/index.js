import { dispatch as busDispatch } from 'use-bus'

import listAPI, { 
	upsyncList 
} 						from './api/lists.js'
import taskAPI, {
	upsyncTask
} 						from './api/tasks.js'
import dashboardAPI, {
	downsyncDashboards,
	downsyncDashboard,
	upsyncDashboard
} 						from './api/dashboards.js'
import userApi			from './api/users.js'

export default {
	signUp: (formData, dispatch) => {
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

		upsyncDashboard(dashboard, dispatch)
	},

	logOut: () => {
		// TODO
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
	downsyncDashboard,

	deleteDashboard: (dashboard, dispatch) => {
		dashboardAPI.deleteOne(dashboard, dispatch)
		// TODO: Recalculate indeces
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
						username: '',
						id: ''
					})

					busDispatch({ type: 'notLoggedIn' })
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
		upsyncDashboard({title: "New Dashboard"}, dispatch)
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
				voted: [],
				votes: {
					yes: 0,
					no: 0
				}
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

				userApi.downsyncOne(newContent.value)
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

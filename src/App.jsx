import React, { useEffect } 			from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } 					from 'react-redux'
import { dispatch as busDispatch } 		from 'use-bus'

import Landing 		from './views/Landing.jsx'
import Home 		from './views/Home.jsx'
import Dashboard 	from './views/Dashboard.jsx'

function checkSession(dispatch) {
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
					username: data.username
				})

				busDispatch({ type: 'loggedIn' })
			} else {
				dispatch({
					type: 'setLoggedIn',
					value: false,
					username: ''
				})

				busDispatch({ type: 'notLoggedIn' })
			}
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

function App() {
	const dispatch = useDispatch()
	
	useEffect(() => {
		checkSession(dispatch)
	}, [dispatch])

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route exact path="/"><Landing /></Route>
					<Route exact path="/home"><Home /></Route>
					<Route exact path="/dashboard:dashboardId"><Dashboard /></Route>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App

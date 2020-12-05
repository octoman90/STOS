import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { dispatch as busDispatch } from 'use-bus'

import Landing 		from './views/Landing.jsx'
import Home 		from './views/Home.jsx'
import Dashboard 	from './views/Dashboard.jsx'

function checkSession(dispatch) {
	fetch('/api/checkSession')
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
				throw new Error(data.message)
			}
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

function App() {
	checkSession(useDispatch())

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

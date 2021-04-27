import React,
	{ useEffect }      from 'react'
import {
	BrowserRouter,
	Routes,
	Route
}                      from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Landing    from './views/Landing.jsx'
import Home       from './views/Home.jsx'
import Dashboard  from './views/Dashboard.jsx'
import controller from './controller'

import './App.scss'

export default function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		controller.checkSession(dispatch)
	}, [dispatch])

	return (
		<BrowserRouter>
			<Routes>
				<Route exact path="/"><Landing /></Route>
				<Route exact path="/home"><Home /></Route>
				<Route exact path="/dashboard:dashboardId"><Dashboard /></Route>
			</Routes>
		</BrowserRouter>
	)
}

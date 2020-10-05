import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './views/Landing.js'
import Dashboard from './views/Dashboard.js'
import './stylesheets/Dashboard.scss'

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route exact path="/"><Landing /></Route>
					<Route exact path="/dashboard"><Dashboard /></Route>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App

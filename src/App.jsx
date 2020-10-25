import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './views/Landing.jsx'
import Home from './views/Home.jsx'
import Dashboard from './views/Dashboard.jsx'

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route exact path="/"><Landing /></Route>
					<Route exact path="/home"><Home /></Route>
					<Route exact path="/dashboard"><Dashboard /></Route>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App

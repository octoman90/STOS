import React, { useState } from 'react'
import '../stylesheets/Landing.scss'


export default function Landing() {
	const [formMode, setFormMode] = useState(0)
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		repeatPassword: '',
		accepted: false
	})

	function submitHandler(event) {
		event.preventDefault()
		console.log(formData)
	}

	function inputChangeHandler(event) {
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name

		let newData = formData
		newData[name] = value
		setFormData(newData)
	}

	return (
		<div id="landing-root">
			<div>
				STOS Team Organization System is an open-sourse tool
				<br />
				for managing your team's work.
			</div>
			<form onSubmit={submitHandler}>
				<span className={formMode === 0 ? 'deactivated' : ''} onClick={() => setFormMode(0)}>Sign Up</span>
				<span className={formMode === 1 ? 'deactivated' : ''} onClick={() => setFormMode(1)}>Log In</span>
				
				<input type="text" name="username" onClick={inputChangeHandler} placeholder="Username"></input>
				
				<input type="password" name="password" onClick={inputChangeHandler} placeholder="Password"></input>
				
				{ formMode === 0 &&
					<input type="password" name="repeatPassword" onClick={inputChangeHandler} placeholder="Repeat password"></input>
				}
				
				{ formMode === 0 &&
					<div id="accept">
						<input type="checkbox" name="accepted" onClick={inputChangeHandler} id="accept-checkbox"></input>
						<label htmlFor="accept-checkbox">I accept</label>
					</div>
				}
				<button>{formMode === 0 ? 'Sign Up' : 'Log In'}</button>
			</form>
		</div>
	)
}

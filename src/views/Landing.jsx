import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../stylesheets/Landing.scss'

export default function Landing() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [formMode, setFormMode] = useState(0)
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		repeatPassword: '',
		accepted: false
	})

	function submitHandler(event) {
		event.preventDefault()

		if (formData.username.length < 5) {
			console.log('username should be at least 5 characters long')
			return
		} else if (formData.password.length < 5) {
			console.log('password should be at least 5 characters long')
			return
		}

		if (formMode === 0) {
			if (formData.password !== formData.repeatPassword) {
				console.log('passwords don\'t match')
				return
			} else if (formData.accepted === false) {
				console.log('you need to accept')
				return
			}
		}

		let options = {
			method: 'POST',
			body: JSON.stringify({
				username: formData.username,
				password: formData.password
			})
		}

		fetch(`/api/${formMode === 0 ? 'signUp' : 'logIn'}`, options)
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

					navigate('/home')
				}
			})
			.catch(err => {
				console.log('error', err.message)
			})
	}

	function inputChangeHandler(event) {
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name

		let partialState = {
			[name]: value
		}

		setFormData(prevState => {
			return {...prevState, ...partialState}
		})
	}

	return (
		<div id="landing-root" className="layout">
			<div>
				STOS Team Organization System is an open-sourse tool
				<br />
				for managing your team's work.
			</div>
			<form onSubmit={submitHandler}>
				<span className={formMode === 0 ? 'deactivated' : ''} onClick={() => setFormMode(0)}>Sign Up</span>
				<span className={formMode === 1 ? 'deactivated' : ''} onClick={() => setFormMode(1)}>Log In</span>
				
				<input type="text" name="username" onChange={inputChangeHandler} placeholder="Username"></input>
				
				<input type="password" name="password" onChange={inputChangeHandler} placeholder="Password"></input>
				
				{ formMode === 0 &&
					<input type="password" name="repeatPassword" onChange={inputChangeHandler} placeholder="Repeat password"></input>
				}
				
				{ formMode === 0 &&
					<div id="accept">
						<input type="checkbox" name="accepted" onChange={inputChangeHandler} id="accept-checkbox"></input>
						<label htmlFor="accept-checkbox" onChange={inputChangeHandler}>I accept</label>
					</div>
				}
				<button>{formMode === 0 ? 'Sign Up' : 'Log In'}</button>
			</form>
		</div>
	)
}

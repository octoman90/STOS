import React, {
	useEffect,
	useState
}                      from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useBus          from 'use-bus'

import controller  from '../controller'

import './Landing.scss'

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

	function inputChangeHandler(event) {
		const key = event.target.name
		const value = event.target.type === 'checkbox'
			? event.target.checked
			: event.target.value

		let partialState = {
			[key]: value
		}

		setFormData(prevState => {
			return { ...prevState, ...partialState }
		})
	}

	function submitHandler(event) {
		event.preventDefault()

		formMode === 0
			? controller.signUp(formData, dispatch)
			: controller.logIn(formData, dispatch)
	}

	useBus(
		'loggedIn',
		() => navigate('/home')
	)

	useEffect(() => {
		document.title = 'Welcome to STOS'
	}, [])

	return (
		<main id="landing-container">
			<div id="landing-info">
				<h1>STOS</h1>
				<div>STOS Team Organisation System is a tool</div>
				<div>for effective team management in Kanban or Scrum style.</div>
			</div>
			<form onSubmit={ submitHandler }>
				<button type="button" className={formMode === 0 ? "active" : ""} onClick={() => setFormMode(0)}>Sign Up</button>
				<button type="button" className={formMode === 1 ? "active" : ""} onClick={() => setFormMode(1)}>Log In</button>

				<input type="text" name="username" onChange={ inputChangeHandler } placeholder="Username"></input>
				<input type="password" name="password" onChange={ inputChangeHandler } placeholder="Password"></input>

				{ formMode === 0 &&
					<>
						<input type="password" name="repeatPassword" onChange={ inputChangeHandler } placeholder="Repeat password"></input>
						<div>
							<input type="checkbox" id="accept-checkbox" name="accepted" onChange={ inputChangeHandler } />
							<label htmlFor="accept-checkbox">I accept</label>
						</div>
					</>
				}

				<button type="submit" id="formSubmitButton">{ formMode === 0 ? 'Sign Up' : 'Log In' }</button>
			</form>
		</main>
	)
}

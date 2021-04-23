import React, {
	useEffect,
	useState
} 							from 'react'
import { useDispatch } 		from 'react-redux'
import { useNavigate } 		from 'react-router-dom'
import useBus 				from 'use-bus'

import Container 		from '../components/landing/Container'
import LandingInfo 		from '../components/landing/LandingInfo'
import Form 			from '../components/landing/Form'
import FormModeSelector from '../components/landing/FormModeSelector'
import TextInput 		from '../components/landing/TextInput'
import Button 			from '../components/landing/Button'
import Accept 			from '../components/landing/Accept'
import controller		from '../controller'

function inputChangeHandler(key, value, setFormData) {
	let partialState = {
		[key]: value
	}

	setFormData(prevState => {
		return {...prevState, ...partialState}
	})
}

function submitHandler(event, formData, formMode, dispatch) {
	event.preventDefault()

	if (formMode === 0) {
		controller.signUp(formData, dispatch)
	} else {
		controller.logIn(formData, dispatch)
	}
}

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

	useBus(
		'loggedIn',
		() => navigate('/home')
	)

	useEffect(() => {
		document.title = "Welcome to STOS"
	}, [])

	return (
		<Container>
			<LandingInfo />
			<Form onSubmit={ e => submitHandler(e, formData, formMode, dispatch) }>
				<FormModeSelector id="signUpModeButton" active={ formMode === 0 } onClick={() => setFormMode(0)}>Sign Up</FormModeSelector>
				<FormModeSelector id="logInModeButton" active={ formMode === 1 } onClick={() => setFormMode(1)}>Log In</FormModeSelector>
				
				<TextInput type="text" name="username" onChange={ e => inputChangeHandler("username", e.target.value, setFormData) } placeholder="Username"></TextInput>
				<TextInput type="password" name="password" onChange={ e => inputChangeHandler("password", e.target.value, setFormData) } placeholder="Password"></TextInput>
				
				{ formMode === 0 &&
					<TextInput type="password" name="repeatPassword" onChange={ e => inputChangeHandler("repeatPassword", e.target.value, setFormData) } placeholder="Repeat password"></TextInput>
				}
				
				{ formMode === 0 &&
					<Accept inputChangeHandler={ inputChangeHandler } setFormData={ setFormData } />
				}

				<Button id="formSubmitButton">{ formMode === 0 ? 'Sign Up' : 'Log In' }</Button>
			</Form>
		</Container>
	)
}

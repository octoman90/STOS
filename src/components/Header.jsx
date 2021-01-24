import React 	from 'react'
import {
	useNavigate
} 				from 'react-router-dom'
import styled 	from 'styled-components'
import ExitIcon from '@material-ui/icons/ExitToApp'

const Container = styled.header`
	display: flex;
	padding: 1em;
	background-color: #0005;
	color: #fff;
	background: rgb(93, 162, 199);
	justify-content: space-between;
`

const Logo = styled.div`
	cursor: pointer;
`

export default function Header() {
	const navigate = useNavigate()

	function logoClickHandler() {
		navigate('/home')
	}

	function exitClickHandler() {
		// controller.logOut()
	}

	return (
		<Container>
			<Logo onClick={ logoClickHandler }>STOS</Logo>
			<ExitIcon onClick={ exitClickHandler } />
		</Container>
	)
}



import React           from 'react'
import { useNavigate } from 'react-router-dom'
import styled          from 'styled-components'
import ExitIcon        from '@material-ui/icons/ExitToApp'
import { useDispatch } from 'react-redux'

import controller      from '../controller'

const Container = styled.header`
	display: flex;
	justify-content: space-between;
	padding: 1em;
	color: #fff;
`

const Logo = styled.div`
	cursor: pointer;
`

export default function Header() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	function logoClickHandler() {
		navigate('/home')
	}

	function exitClickHandler() {
		controller.logOut(dispatch)
	}

	return (
		<Container>
			<Logo onClick={ logoClickHandler }>STOS</Logo>
			<ExitIcon onClick={ exitClickHandler } style={{ cursor: 'pointer' }} />
		</Container>
	)
}



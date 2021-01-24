import React 	from 'react'
import {
	useDispatch
} 				from 'react-redux'
import {
	useNavigate
} 				from 'react-router-dom'
import styled, {
	css
} 				from 'styled-components'
import PlusIcon from '@material-ui/icons/Add'

import controller from '../controller'

const Container = styled.div`
	background: #f8f8f8;
	height: 7em;
	width: 13em;
	padding: 0.5em;
	box-sizing: border-box;
	cursor: pointer;

	${props => props.createDashboardButton && css`
		color: #777;
		display: flex;
		justify-content: center;
		align-items: center;
	`}
` 

export default function DashboardBanner({ meta }) {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	function clickHandler() {
		meta.id
			? navigate(`/dashboard${meta.id}`)
			: controller.createDashboard(dispatch)
	}

	return (
		<Container createDashboardButton={ meta.id === undefined } onClick={ clickHandler }>
			{ meta.title || <PlusIcon style={{ zoom: 2 }}/> }
		</Container>
	)
}

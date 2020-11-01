import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
	background: #f8f8f8;
	height: 7em;
	width: 13em;
	padding: 0.5em;
	box-sizing: border-box;
	cursor: pointer;
` 

export default function DashboardBanner({ meta }) {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	function clickHandler() {
		meta.id
			? navigate(`/dashboard${meta.id}`)
			: dispatch({ type: 'createDashboard' })
	}

	return (
		<Container onClick={ clickHandler }>
			{ meta.title || "Create new" }
		</Container>
	)
}

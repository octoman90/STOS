import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'

const Container = styled.div`
	background: #f8f8f8;
	height: 7em;
	width: 13em;
	padding: 0.5em;
	box-sizing: border-box;
	cursor: pointer;

	${props => props.createDashboardButton && css`
		color: #777;
	`}
` 

function upsyncDashboard(dashboard, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(dashboard)
	}

	fetch('/api/syncDashboard', options)
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setDashboard',
				dashboard: data || {}
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default function DashboardBanner({ meta }) {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	function clickHandler() {
		meta.id
			? navigate(`/dashboard${meta.id}`)
			: upsyncDashboard({title: "New Dashboard"}, dispatch)
	}

	return (
		<Container createDashboardButton={ meta.id === undefined } onClick={ clickHandler }>
			{ meta.title || "Add Dashboard" }
		</Container>
	)
}

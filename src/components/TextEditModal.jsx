import React, { useState } 			from 'react'
import styled 						from 'styled-components'
import { useSelector } 				from 'react-redux'
import { dispatch as busDispatch } 	from 'use-bus'

const Container = styled.div`
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	position: fixed;

	display: flex;
	justify-content: center;
	align-items: center;
`

const BackLayer = styled.div`
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	position: fixed;
	z-index: 100;

	background-color: #0005
`

const Modal = styled.div`
	background-color: #fff;
	padding: 1em;
	height: 70vh;
	width: 35vw;

	z-index: 101;
`

export default function TaskModal({ field, dashboardID }) {
	const [value, setValue] = useState('')

	function backLayerClickHandler() {
		busDispatch({ type: 'showTextEditModal' })
	}

	function buttonClickHandler() {
		busDispatch({ type: 'submitTextModal', field, dashboardID, value })
		busDispatch({ type: 'showTextEditModal' })
	}

	return (
		<Container>
			<BackLayer onClick={ backLayerClickHandler } />
			<Modal>
				<input type="text" onChange={ event => setValue(event.target.value) }></input>
				<button type="button" onClick={ buttonClickHandler }>Submit</button>
			</Modal>
		</Container>
	)
}

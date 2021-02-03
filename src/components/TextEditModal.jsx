import React, { useState } 			from 'react'
import styled 						from 'styled-components'
import { dispatch as busDispatch } 	from 'use-bus'

import ModalHeader from './ModalHeader'

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
	height: 10vh;
	width: 35vw;

	z-index: 101;
`

export default function TaskModal({ field, dashboardID, listID, taskID, moduleID, innerIndex, dt = 'text', caption }) {
	const [value, setValue] = useState('')

	function backLayerClickHandler() {
		busDispatch({ type: 'showTextEditModal' })
	}

	function buttonClickHandler() {
		busDispatch({ type: 'submitTextEditModal', field, dashboardID, listID, taskID, moduleID, value, innerIndex })
		backLayerClickHandler()
	}

	return (
		<Container>
			<BackLayer onClick={ backLayerClickHandler } />
			<Modal>
				<ModalHeader>{ caption }</ModalHeader><br />
				{
					(() => {
						// eslint-disable-next-line
						if (dt == 'text') {
							return <input type="text" onChange={ event => setValue(event.target.value) }></input>
						// eslint-disable-next-line
						} else if (dt == 'datetime') {
							return <input type="datetime-local" onChange={ event => setValue(event.target.value) }></input>
						}
					})()
				}
				<button type="button" onClick={ buttonClickHandler }>Submit</button>
			</Modal>
		</Container>
	)
}

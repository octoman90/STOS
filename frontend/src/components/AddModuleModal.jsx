import React 						from 'react'
import styled 						from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import {
	dispatch as busDispatch
} 									from 'use-bus'

import ModalHeader 	from './ModalHeader'
import controller 	from '../controller'

const modules = {
	description: 	'Description',
	timer: 			'Timer',
	userList: 		'User List',
	poll: 			'Poll',
}

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

const Row = styled.div`
	background-color: #ccc;
	padding: 0.25em;
	cursor: pointer;
`

export default function AddModuleModal({ taskID }) {
	const task = useSelector(state => state.tasks[taskID])
	const dispatch = useDispatch()

	function backLayerClickHandler() {
		busDispatch({ type: 'showAddModuleModal', taskID: null })
	}

	function selectType(type) {
		controller.addModule(task, type, dispatch)
		backLayerClickHandler()
	}

	return (
		<Container>
			<BackLayer onClick={ backLayerClickHandler } />
			<Modal>
				<div style={{ display: 'flex', margin: '0.5em' }}>
					<ModalHeader>Select the module type:</ModalHeader>
				</div>
				{
					Object.entries(modules).map(([type, tTitle]) => {
						return <Row key={ type } data-type={ type } onClick={ () => selectType(type) }>{ tTitle }</Row>
					})
				}
			</Modal>
		</Container>
	)
}

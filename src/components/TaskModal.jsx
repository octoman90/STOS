import React 						from 'react'
import styled 						from 'styled-components'
import { useSelector } 				from 'react-redux'
import { dispatch as busDispatch } 	from 'use-bus'

import Description 	from './taskModules/Description.jsx'
import TagList 		from './taskModules/TagList.jsx'

const modules = {
	description: Description,
	tagList: TagList
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

export default function TaskModal({ taskID }) {
	const task = useSelector(state => state.tasks[taskID])

	function backLayerClickHandler() {
		busDispatch({ type: 'showTaskModal', taskID: null })
	}

	return (
		<Container>
			<BackLayer onClick={ backLayerClickHandler } />
			<Modal>
				<h2>{ task.title }</h2>
				{
					(task.modules || []).map((module, index) => {
						return React.createElement(
							modules[module.type], 
							{
								key: index, 
								meta: module, 
								full: true
							}
						)
					})
				}
			</Modal>
		</Container>
	)
}

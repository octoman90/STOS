import React 						from 'react'
import styled 						from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import DeleteIcon 					from '@material-ui/icons/Delete'
import EditIcon 					from '@material-ui/icons/Edit'
import useBus, {
	dispatch as busDispatch
} 									from 'use-bus'

import Description 		from './taskModules/Description.jsx'
import TagList 			from './taskModules/TagList.jsx'
import { upsyncTask } 	from '../api/tasks.js'

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

function renameTask(task, value, dispatch) {
	task.title = value

	dispatch({
		type: 'setTask',
		task
	})

	upsyncTask(task, dispatch)
}

export default function TaskModal({ taskID }) {
	const task = useSelector(state => state.tasks[taskID])
	const dispatch = useDispatch()

	function backLayerClickHandler() {
		busDispatch({ type: 'showTaskModal', taskID: null })
	}

	function titleEditClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'taskName',
			taskID 
		})
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			if (params.field == 'taskName' && params.taskID == taskID) {
				renameTask(task, params.value, dispatch)
			}
		},
		[task, taskID, dispatch],
	)

	return (
		<Container>
			<BackLayer onClick={ backLayerClickHandler } />
			<Modal>
				<h2>{ task.title }</h2>
				<EditIcon onClick={ titleEditClickHandler } />
				<DeleteIcon />
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

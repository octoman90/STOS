import React				from 'react'
import styled 				from 'styled-components'
import {
	useSelector,
	useDispatch
} 							from 'react-redux'
import DeleteIcon 			from '@material-ui/icons/Delete'
import EditIcon 			from '@material-ui/icons/Edit'
import PlusIcon 			from '@material-ui/icons/Add'
import useBus, {
	dispatch as busDispatch
} 							from 'use-bus'

import Description 	from './taskModules/Description.jsx'
import Poll			from './taskModules/Poll'
import Timer 		from './taskModules/Timer.jsx'
import UserList 	from './taskModules/UserList.jsx'
import controller 	from '../controller'

const modules = {
	description: 	Description,
	poll: 			Poll,
	timer: 			Timer,
	userList: 		UserList
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

const NewModule = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	color: #777
`

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
			taskID,
			caption: 'Enter the new task title:'
		})
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			// eslint-disable-next-line
			if (params.field == 'taskName' && params.taskID == taskID) {
				controller.renameTask(task, params.value, dispatch)
			}
		},
		[task, taskID, dispatch],
	)

	function deleteClickHandler() {
		busDispatch({ type: 'showTaskModal', taskID: null })
		controller.deleteTask(task, dispatch)
	}

	function newModuleClickHandler() {
		busDispatch({ type: 'showAddModuleModal', taskID })
	}

	return (
		<Container>
			<BackLayer onClick={ backLayerClickHandler } />
			<Modal>
				<div style={{ display: 'flex', margin: '0.5em' }}>
					<h2 style={{ margin: '0' }}>{ task.title }</h2>
					<EditIcon className="hover-visible" onClick={ titleEditClickHandler } />
					<DeleteIcon className="hover-visible" onClick={ deleteClickHandler } />
				</div>
				{ task.modules && 
					task.modules.map((moduleJSON, index) => {
						let module = JSON.parse(moduleJSON)

						return React.createElement(
							modules[module.type], 
							{
								key: module.id,
								meta: module, 
								full: true,
								task
							}
						)
					})
				}

				<NewModule onClick={ newModuleClickHandler } >
					<PlusIcon style={{ zoom: 2 }} />
				</NewModule>
			</Modal>
		</Container>
	)
}

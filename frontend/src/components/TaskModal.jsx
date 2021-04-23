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
import ModalHeader 	from './ModalHeader'
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

export default function TaskModal({ taskID, currentUserCanEdit }) {
	const tasks = useSelector(state => state.tasks)
	const task = tasks[taskID]
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
			if (params.field === 'taskName' && params.taskID === taskID) {
				controller.renameTask(task, params.value, dispatch)
			}
		},
		[task, taskID, dispatch],
	)

	function deleteClickHandler() {
		busDispatch({ type: 'showTaskModal', taskID: null })
		controller.deleteTask(tasks, task, dispatch)
	}

	function newModuleClickHandler() {
		busDispatch({ type: 'showAddModuleModal', taskID })
	}

	return (
		<Container>
			<BackLayer onClick={ backLayerClickHandler } />
			<Modal>
				<div style={{ display: 'flex', margin: '0.5em' }}>
					<ModalHeader>{ task.title }</ModalHeader>
					{ currentUserCanEdit &&
						<EditIcon className="hover-visible" onClick={ titleEditClickHandler } style={{ cursor: 'pointer' }} />
					}
					{ currentUserCanEdit &&
						<DeleteIcon className="hover-visible" onClick={ deleteClickHandler } style={{ cursor: 'pointer' }} />
					}
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
								currentUserCanEdit,
								task
							}
						)
					})
				}

				{ currentUserCanEdit &&
					<NewModule onClick={ newModuleClickHandler } >
						<PlusIcon style={{ zoom: 2, cursor: 'pointer' }} />
					</NewModule>
				}
			</Modal>
		</Container>
	)
}

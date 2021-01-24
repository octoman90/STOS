import React 						from 'react'
import styled 						from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import DeleteIcon 					from '@material-ui/icons/Delete'
import EditIcon 					from '@material-ui/icons/Edit'
import PlusIcon 					from '@material-ui/icons/Add'
import useBus, {
	dispatch as busDispatch
} 									from 'use-bus'

import Description 	from './taskModules/Description.jsx'
import TagList 		from './taskModules/TagList.jsx'
import Timer 		from './taskModules/Timer.jsx'
import UserList 	from './taskModules/UserList.jsx'
import taskAPI, {
	upsyncTask
} 						from '../api/tasks.js'

const modules = {
	description: 	Description,
	tagList: 		TagList,
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

	function deleteClickHandler() {
		busDispatch({ type: 'showTaskModal', taskID: null })
		taskAPI.deleteOne(task, dispatch)
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

				<Description key={ 0 } meta={{ content: "Zaimplementować interfejs." }} full={ true } />
				<Timer key={ 1 } meta={{ content: "10d 5h 57m" }} full={ true } />
				<UserList key={ 2 } meta={{ content: ['Maksym'] }} full={ true } />

				<NewModule>
					<PlusIcon style={{ zoom: 2 }} />
				</NewModule>
			</Modal>
		</Container>
	)
}

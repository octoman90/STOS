import React, { useState, useEffect } 	from 'react'
import { useSelector, useDispatch } 	from 'react-redux'
import { useParams } 					from 'react-router-dom'
import { DragDropContext } 				from 'react-beautiful-dnd'
import { useNavigate } 					from 'react-router-dom'
import useBus 							from 'use-bus'
import styled 							from 'styled-components'
import { dispatch as busDispatch } 		from 'use-bus'
import DeleteIcon 						from '@material-ui/icons/Delete'
import EditIcon 						from '@material-ui/icons/Edit'

import Header 			from '../components/Header.jsx'
import List 			from '../components/List.jsx'
import TaskModal 		from '../components/TaskModal.jsx'
import AddModuleModal 	from '../components/AddModuleModal.jsx'
import TextEditModal 	from '../components/TextEditModal.jsx'
import controller		from '../controller'

const InfoBar = styled.div`
	background: #fff;

	display: flex;
	padding: 0.5em;
`

const DUL = styled.div`
	display: flex;
	gap: 0.5em;
`

const U = styled.div`
	padding: 0.5em;
	background-color: #fff;
	border-radius: 0.3em;
	width: 7em;
	border: 1px solid #777;
	text-align: center;
`

function DashboardUserList({ dashboard }) {
	const dispatch = useDispatch()
	const users = useSelector(state => state.users)

	function plusClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'dashboardUsers',
			dt: 'text',
			caption: 'Enter user\'s name:'
		})
	}

	useBus(
		'submitTextEditModal',
		({ field, value }) => {
			// eslint-disable-next-line
			if (field == 'dashboardUsers') {
				// controller.editTaskModule(task, meta.id, { action: 'push', value }, dispatch)
			}
		},
		[dashboard, dispatch],
	)

	function deleteClickHandler() {
		// controller.deleteTaskModule(task, meta.id, dispatch)
	}

	function userClickHandler(userID) {
		// let newContent = JSON.parse(JSON.stringify(meta.content))
		// newContent.splice(index, 1)

		// controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
	}

	return (
		<DUL>
			<U>{ (users[dashboard.ownerID] || { name: '' }).name }</U>
			{ (dashboard.userIDs || []).map(userID => <U key={ userID } onClick={ () => userClickHandler(userID) }>{ users[userID].name }</U>)}
			<U style={{ width: '1em' }} onClick={ plusClickHandler }>+</U>
		</DUL>
	)
}

export default function Dashboard() {
	const { dashboardId } = useParams()
	const dashboard = useSelector(state => state.dashboards[dashboardId])
	const lists = useSelector(state => state.lists)
	const tasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [taskModalTaskID, setTaskModalTaskID] = useState(null)
	const [addModuleModalTaskID, showAddModuleModalTaskID] = useState(null)
	const [textEditModal, setTextEditModal] = useState({})

	useBus(
		'showTaskModal',
		({ taskID }) => setTaskModalTaskID(taskID),
		[taskModalTaskID],
	)

	useBus(
		'showAddModuleModal',
		({ taskID }) => showAddModuleModalTaskID(taskID),
		[addModuleModalTaskID],
	)

	useBus(
		'showTextEditModal',
		({ field, dashboardID, listID, taskID, moduleID, innerIndex, dt, caption }) => {
			setTextEditModal(field !== undefined ? { field, dashboardID, listID, taskID, moduleID, innerIndex, dt, caption } : {})
		},
		[textEditModal],
	)

	useBus(
		'loggedOut',
		() => navigate('/')
	)

	useBus(
		'submitTextEditModal',
		({ field, dashboardID, value }) => {
			// eslint-disable-next-line
			if (field == 'dashboardName' && dashboardID == dashboard.id) {
				controller.renameDashboard(dashboard, value, dispatch)
			}
		},
		[dashboard, dispatch],
	)

	function dragEndHandler(result) {
		const { destination, source } = result

		if (destination && (destination.index !== source.index || destination.droppableId !== source.droppableId)) {
			controller.moveTask(
				tasks, 
				result.draggableId, 
				{ listID: source.droppableId, index: source.index },
				{ listID: destination.droppableId, index: destination.index },
				dispatch
			)
		}
	}

	function titleEditClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'dashboardName',
			dashboardID: dashboardId,
			caption: 'Enter the new dashboard title:'
		})
	}

	function deleteClickHandler() {
		controller.deleteDashboard(dashboard, dispatch)
		navigate('/home')
	}

	useEffect(() => {
		controller.downsyncDashboard(dashboardId, dispatch)
		controller.downsyncManyLists(dashboardId, dispatch)
	}, [dashboardId, dispatch])

	return (
		<div className="layout">
			<Header />
			<InfoBar>
				<div>{ dashboard ? dashboard.title : "" }</div>
				<EditIcon className="hover-visible" onClick={ titleEditClickHandler } style={{ verticalAlign: "bottom" }}/>
				<DeleteIcon className="hover-visible" onClick={ deleteClickHandler } style={{ verticalAlign: "bottom" }}/>
				{ dashboard &&
					<DashboardUserList dashboard={ dashboard } />
				}
			</InfoBar>
			<div id="dashboard-root">
				<div className="background-layer"></div>
				<DragDropContext onDragEnd={ dragEndHandler }>
					{ 
						Object.values(lists).sort((a, b) => a.index - b.index).map(list => {
							return list.dashboard === dashboardId ? <List key={ list.id } listID={ list.id } dashboardID={ dashboardId } /> : null
						})
					}
				</DragDropContext>

				<List dashboardID={ dashboardId } />
			</div>

			{ taskModalTaskID &&
				<TaskModal taskID={ taskModalTaskID } />
			}

			{ Object.keys(textEditModal).length > 0 &&
				<TextEditModal field={ textEditModal.field } dashboardID={ textEditModal.dashboardID } listID={ textEditModal.listID } taskID={ textEditModal.taskID } moduleID={ textEditModal.moduleID } innerIndex={ textEditModal.innerIndex } dt={ textEditModal.dt } caption={ textEditModal.caption } />
			}

			{ addModuleModalTaskID &&
				<AddModuleModal taskID={ addModuleModalTaskID } />
			}
		</div>
	)
}

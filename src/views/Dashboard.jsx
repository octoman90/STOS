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
import CollabNoIcon 					from '@material-ui/icons/AssignmentLate'
import CollabYeIcon 					from '@material-ui/icons/AssignmentTurnedIn'

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

const DTitle = styled.div`
	cursor: default
`

const DUL = styled.div`
	margin-left: 5em;
	display: flex;
	gap: 0.5em;
`

const U = styled.div`
	padding: 0.25em;
	background-color: #fff;
	border-radius: 0.3em;
	width: 7em;
	border: 1px solid #777;
	text-align: center;
	cursor: not-allowed;
`

function DashboardUserList({ dashboard, currentUserCanEdit }) {
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
				controller.addUserToDashboard(dashboard, value, dispatch)
			}
		},
		[dashboard, dispatch],
	)

	function userClickHandler(userID) {
		if (!currentUserCanEdit) {
			return
		}

		controller.removeUserFromDashboard(dashboard, userID, dispatch)
	}

	return (
		<DUL>
			<U style={{ cursor: 'default' }}>{ (users[dashboard.ownerID] || { name: '' }).name }</U>
			{ (dashboard.userIDs || []).map(userID => <U key={ userID } onClick={ () => userClickHandler(userID) }>{ (users[userID] || { name: '' }).name }</U>)}
			{ currentUserCanEdit &&
				<U style={{ width: '1em', cursor: 'pointer' }} onClick={ plusClickHandler }>+</U>
			}
		</DUL>
	)
}

function CollaborativeIcon({ dashboard }) {
	const dispatch = useDispatch()

	function clickHandler(value) {
		controller.setDashboardCollaborative(dashboard, value, dispatch)
	}

	if (dashboard.collaborative) {
		return <CollabYeIcon className="hover-visible" onClick={ () => clickHandler(false) } style={{ verticalAlign: "bottom", cursor: 'pointer' }} />
	} else {
		return <CollabNoIcon className="hover-visible" onClick={ () => clickHandler(true) } style={{ verticalAlign: "bottom", cursor: 'pointer' }} />
	}
}

export default function Dashboard() {
	const { dashboardId } = useParams()
	const dashboard = useSelector(state => state.dashboards[dashboardId])
	const lists = useSelector(state => state.lists)
	const tasks = useSelector(state => state.tasks)
	const user = useSelector(state => state.user)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [taskModalTaskID, setTaskModalTaskID] = useState(null)
	const [addModuleModalTaskID, showAddModuleModalTaskID] = useState(null)
	const [textEditModal, setTextEditModal] = useState({})
	const currentUserCanEdit = dashboard && (dashboard.ownerID === user.id || dashboard.collaborative)

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
		if (!currentUserCanEdit) {
			return
		}

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
				<DTitle>{ dashboard ? dashboard.title : "" }</DTitle>
				{ currentUserCanEdit &&
					<EditIcon className="hover-visible" onClick={ titleEditClickHandler } style={{ verticalAlign: "bottom", cursor: 'pointer' }}/>
				}
				{ currentUserCanEdit &&
					<DeleteIcon className="hover-visible" onClick={ deleteClickHandler } style={{ verticalAlign: "bottom", cursor: 'pointer' }}/>
				}
				{ currentUserCanEdit && 
					<CollaborativeIcon dashboard={ dashboard } />
				}
				{ dashboard &&
					<DashboardUserList currentUserCanEdit={ currentUserCanEdit } dashboard={ dashboard } />
				}
			</InfoBar>
			<div id="dashboard-root">
				<div className="background-layer"></div>
				<DragDropContext onDragEnd={ dragEndHandler }>
					{ 
						Object.values(lists).sort((a, b) => a.index - b.index).map(list => {
							return list.dashboard === dashboardId ? <List key={ list.id } listID={ list.id } dashboardID={ dashboardId } currentUserCanEdit={ currentUserCanEdit } /> : null
						})
					}
				</DragDropContext>

				{ currentUserCanEdit &&
					<List dashboardID={ dashboardId } />
				}
			</div>

			{ taskModalTaskID &&
				<TaskModal currentUserCanEdit={ currentUserCanEdit } taskID={ taskModalTaskID } />
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

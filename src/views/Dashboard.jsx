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
		({ field, dashboardID, listID, taskID, dt }) => {
			setTextEditModal(field !== undefined ? { field, dashboardID, listID, taskID, dt } : {})
		},
		[textEditModal],
	)

	useBus(
		'submitTextEditModal',
		({ field, dashboardID, value }) => {
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
			dashboardID: dashboardId
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
			</InfoBar>
			<div id="dashboard-root">
				<div className="background-layer"></div>
				<DragDropContext onDragEnd={ dragEndHandler }>
					{ 
						Object.values(lists).sort((a, b) => a.index - b.index).map(list => {
							return list.dashboard == dashboardId ? <List key={ list.id } listID={ list.id } dashboardID={ dashboardId } /> : null
						})
					}
				</DragDropContext>

				<List dashboardID={ dashboardId } />
			</div>

			{ taskModalTaskID &&
				<TaskModal taskID={ taskModalTaskID } />
			}

			{ Object.keys(textEditModal).length > 0 &&
				<TextEditModal field={ textEditModal.field } dashboardID={ textEditModal.dashboardID } listID={ textEditModal.listID } taskID={ textEditModal.taskID } dt={ textEditModal.dt } />
			}

			{ addModuleModalTaskID &&
				<AddModuleModal taskID={ addModuleModalTaskID } />
			}
		</div>
	)
}

import React, { useState, useEffect } 	from 'react'
import { useSelector, useDispatch } 	from 'react-redux'
import { useParams } 					from 'react-router-dom'
import { DragDropContext } 				from 'react-beautiful-dnd'
import useBus 							from 'use-bus'
import styled 							from 'styled-components'

import Header 		from '../components/Header.jsx'
import List 		from '../components/List.jsx'
import TaskModal 	from '../components/TaskModal.jsx'

const TaskModalContainer = styled.div`
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	position: fixed;

	display: flex;
	justify-content: center;
	align-items: center;

	background-color: #0005
`

function downsyncLists(dashboardID, dispatch) {
	fetch('/api/syncList?' + new URLSearchParams({ dashboardID }))
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setLists',
				lists: data || []
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default function Dashboard() {
	const { dashboardId } = useParams()
	const dashboard = useSelector(state => state.dashboards[dashboardId])
	const lists = useSelector(state => state.lists)
	const dispatch = useDispatch()
	const [taskModalTaskId, setTaskModalTaskId] = useState(null)

	useBus(
		'showTaskModal',
		({ taskId }) => setTaskModalTaskId(taskId),
		[taskModalTaskId],
	)

	function dragEndHandler(result) {
		const { destination, source } = result

		if (destination && (destination.index !== source.index || destination.droppableId !== source.droppableId)) {
			dispatch({
				type: 'moveTask',
				taskId: result.draggableId,
				source: {
					listId: source.droppableId,
					index: source.index
				},
				destination: {
					listId: destination.droppableId,
					index: destination.index
				}
			})
		}
	}

	useEffect(() => {
		downsyncLists(dashboardId, dispatch)
	}, [dashboardId, dispatch])

	return (
		<div className="layout">
			<Header />
			<div id="dashboard-root">
				<div className="background-layer"></div>
				<DragDropContext onDragEnd={ dragEndHandler }>
					{ 
						Object.entries(lists).map(([listID, list]) => {
							return list.dashboard == dashboardId ? <List key={ listID } listID={ listID } dashboardID={ dashboardId } /> : null
						})
					}
				</DragDropContext>

				<List dashboardID={ dashboardId } />
			</div>

			{ taskModalTaskId &&
				<TaskModalContainer>
					<TaskModal taskId={ taskModalTaskId } />
				</TaskModalContainer>
			}
		</div>
	)
}

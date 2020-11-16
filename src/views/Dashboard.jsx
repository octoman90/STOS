import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import useBus from 'use-bus'
import styled from 'styled-components'

import Header from '../components/Header.jsx'
import List from '../components/List.jsx'
import TaskModal from '../components/TaskModal.jsx'

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

export default function Dashboard() {
	const { dashboardId } = useParams()
	const dashboard = useSelector(state => state.dashboards[dashboardId])
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

	return (
		<div className="layout">
			<Header />
			<div id="dashboard-root">
				<div className="background-layer"></div>
				<DragDropContext onDragEnd={ dragEndHandler }>
					{ 'listIds' in dashboard &&
						dashboard.listIds.map(listId => {
							return <List key={ listId } listId={ listId } dashboardId={ dashboardId } />
						})
					}
				</DragDropContext>

				<List dashboardId={ dashboardId } />
			</div>

			{ taskModalTaskId &&
				<TaskModalContainer>
					<TaskModal taskId={ taskModalTaskId } />
				</TaskModalContainer>
			}
		</div>
	)
}

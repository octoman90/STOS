import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'

import Header from '../components/Header.jsx'
import List from '../components/List.jsx'

export default function Dashboard() {
	const { dashboardId } = useParams()
	const dashboard = useSelector(state => state.dashboards[dashboardId])
	const dispatch = useDispatch()

	function dragEndHandler(result) {
		const { destination, source } = result

		if (destination && (destination.index !== source.index || destination.droppableId !== source.droppableId)) {
			dispatch({
				type: 'moveTask',
				dashboardId: dashboardId,
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
					{
						dashboard.listIds.map(listId => {
							return <List key={ listId } meta={ dashboard.lists[listId] } tasks={ dashboard.tasks } />
						})
					}
				</DragDropContext>
			</div>
		</div>
	)
}

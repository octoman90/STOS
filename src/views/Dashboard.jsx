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
	fetch('/api/syncLists?' + new URLSearchParams({ dashboardID }))
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

function upsyncTasks(data, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/syncTasks', options)
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setTasks',
				tasks: data || []
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

function moveTask(state, taskID, source, destination, dispatch) {
	const patch = [{
		...state[taskID],
		index: destination.index,
		list: destination.listID
	}]

	function getMaxIndex(listID) {
		let sorted = Object.values(state).filter(task => task.list === listID && task.id !== taskID).sort((a, b) => b.index - a.index)
		return sorted.length ? sorted[0].index : -1
	}

	function getID(listID, index) {
		return Object.values(state).find(task => task.list === listID && task.index === index).id
	}

	if (source.listID == destination.listID) {
		if (source.index < destination.index) {
			for (let i = source.index + 1; i <= destination.index; ++i) {
				patch.push({
					...state[getID(source.listID, i)],
					index: i - 1
				})
			}
		} else {
			for (let i = source.index - 1; i >= destination.index; --i) {
				patch.push({
					...state[getID(source.listID, i)],
					index: i + 1
				})
			}
		}
	} else {
		let sMaxIndex = getMaxIndex(source.listID)
		if (sMaxIndex >= 0) {
			for (let i = source.index + 1; i <= sMaxIndex; ++i) {
				patch.push({
					...state[getID(source.listID, i)],
					index: i - 1
				})
			}
		}

		let dMaxIndex = getMaxIndex(destination.listID)
		if (dMaxIndex >= 0) {
			for (let i = dMaxIndex; i >= destination.index; --i) {
				patch.push({
					...state[getID(destination.listID, i)],
					index: i + 1
				})
			}
		}
	}

	dispatch({
		type: 'setTasks',
		tasks: patch
	})

	upsyncTasks(patch, dispatch)
}

export default function Dashboard() {
	const { dashboardId } = useParams()
	const dashboard = useSelector(state => state.dashboards[dashboardId])
	const lists = useSelector(state => state.lists)
	const tasks = useSelector(state => state.tasks)
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
			moveTask(
				tasks, 
				result.draggableId, 
				{ listID: source.droppableId, index: source.index },
				{ listID: destination.droppableId, index: destination.index },
				dispatch
			)
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
						Object.values(lists).sort((a, b) => a.index - b.index).map(list => {
							return list.dashboard == dashboardId ? <List key={ list.id } listID={ list.id } dashboardID={ dashboardId } /> : null
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

import React, { useEffect } 		from 'react'
import styled, { css } 				from 'styled-components'
import { Droppable } 				from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'

import Task from './Task.jsx'

const Container = styled.div`
	background-color: #fff;
	padding: 0.5em;
	margin: 0.5em;
	width: 20em;
	cursor: pointer;

	${props => props.createListButton && css`
		color: #777;
	`}
`

const ListHeader = styled.div`
	padding: 1em 0.5em 1.5em 0.5em;
`

function upsyncList(data, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/syncList', options)
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setList',
				list: data || {}
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

function downsyncTasks(listID, dispatch) {
	fetch('/api/syncTask?' + new URLSearchParams({ listID }))
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

export default function List({ listID, dashboardID }) {
	const list = useSelector(state => state.lists[listID])
	const tasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()

	function createListClickHandler() {
		upsyncList({ title: "New List", dashboard: dashboardID }, dispatch)
	}

	useEffect(() => {
		downsyncTasks(listID, dispatch)
	}, [listID, dispatch])

	if (listID) {
		return (
			<Container className="list">
				<ListHeader className="list-header">{ list.title }</ListHeader>
				<Droppable droppableId={ listID }>
					{ provided => (
						<div ref={ provided.innerRef } { ...provided.droppableProps }>
							{
								tasks.map((task, index) => {
									return listID == task.list ? <Task key={ task.id } taskID={ task.id } index={ index } /> : null
								})
							}
							{ provided.placeholder }
						</div>
					)}
				</Droppable>

				<Task listID={ listID } />
			</Container>
		)
	} else {
		return (
			<Container createListButton className="list create-list-button" onClick={ createListClickHandler }>
				<ListHeader className="list-header">Add list</ListHeader>
			</Container>
		)
	}
}

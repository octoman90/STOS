import React from 'react'
import styled, { css } from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
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

export default function List({ listId, dashboardID }) {
	const list = useSelector(state => state.lists[listId])
	const dispatch = useDispatch()

	function createListClickHandler() {
		upsyncList({title: "New List", dashboard: dashboardID}, dispatch)
	}

	if (listId) {
		return (
			<Container className="list">
				<ListHeader className="list-header">{ list.title }</ListHeader>
				<Droppable droppableId={ listId }>
					{ provided => (
						<div ref={ provided.innerRef } { ...provided.droppableProps }>
							{ list.taskIds && 
								list.taskIds.map((taskId, index) => (
									<Task key={ taskId } taskId={ taskId } index={ index } />
								))
							}
							{ provided.placeholder }
						</div>
					)}
				</Droppable>

				<Task dashboardId={ dashboardID } listId={ listId } />
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

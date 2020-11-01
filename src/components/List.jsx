import React from 'react'
import styled, { css } from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'

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

export default function List({ meta, tasks, dashboardId }) {
	const dispatch = useDispatch()

	function createListClickHandler() {
		dispatch({ type: 'createList', dashboardId })
	}

	if (meta) {
		return (
			<Container className="list">
				<ListHeader className="list-header">{ meta.title }</ListHeader>
				<Droppable droppableId={ meta.id }>
					{ provided => (
						<div ref={ provided.innerRef } { ...provided.droppableProps }>
							{ meta.taskIds && 
								meta.taskIds.map((taskId, index) => (
									<Task key={ taskId } meta={ tasks[taskId] } index={ index } />
								))
							}
							{ provided.placeholder }
						</div>
					)}
				</Droppable>

				<Task dashboardId={ dashboardId } listId={ meta.id } />
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

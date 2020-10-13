import React from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Task from './Task.jsx'

const Container = styled.div`
	background-color: #fff;
	padding: 0.5em;
	margin: 0.5em;
	width: 20em;
`

const ListHeader = styled.div`
	padding: 1em 0.5em 1.5em 0.5em;
`

export default function List({ meta, tasks }) {
	return (
		<Container className="list">
			<ListHeader className="list-header">{ meta.title }</ListHeader>
			<Droppable droppableId={ meta.id }>
				{ provided => (
					<div ref={ provided.innerRef } { ...provided.droppableProps }>
						{ meta.taskIds.map((taskId, index) => (
							<Task key={ taskId } meta={ tasks[taskId] } index={ index } />
						)
						)}
						{ provided.placeholder }
					</div>
				)}
			</Droppable>
		</Container>
	)
}

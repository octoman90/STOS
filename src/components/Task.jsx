import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
	border-top: 1px solid #ddd;
	background-color: #fff;
	padding: 0.5em;
`

export default function Task({ meta, index }) {
	return (
		<Draggable draggableId={ meta.id } index={ index }>
			{ provided => (
				<Container className="task" { ...provided.draggableProps } { ...provided.dragHandleProps } ref={ provided.innerRef }>
					{ meta.title }
				</Container>
			)}
		</Draggable>
	)
}

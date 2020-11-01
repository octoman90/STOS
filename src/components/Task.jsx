import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'

import Description from './taskModules/Description.jsx'
import TagList from './taskModules/TagList.jsx'

const modules = {
	description: Description,
	tagList: TagList
}

const Container = styled.div`
	border-top: 1px solid #ddd;
	background-color: #fff;
	padding: 0.5em;
	display: flex;
	flex-direction: column;
`

export default function Task({ meta, index, dashboardId, listId }) {
	const dispatch = useDispatch()

	function createTaskClickHandler() {
		dispatch({ type: 'createTask', dashboardId, listId })
	}

	if (meta) {
		return (
			<Draggable draggableId={ meta.id } index={ index }>
				{ provided => (
					<Container className="task" { ...provided.draggableProps } { ...provided.dragHandleProps } ref={ provided.innerRef }>
						{ meta.title }
						{
							meta.modules.map((module, index) => {
								return React.createElement(
									modules[module.type], 
									{
										key: index, 
										meta: module, 
										full: false
									}
								)
							})
						}
					</Container>
				)}
			</Draggable>
		)
	} else {
		return (
			<Container className="task create-task" onClick={ createTaskClickHandler }>
				Add Task
			</Container>
		)
	}
}

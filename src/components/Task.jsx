import React from 'react'
import styled, { css } from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'

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

	${props => props.createTaskButton && css`
		color: #777;
	`}
`

export default function Task({ taskId, index, dashboardId, listId }) {
	const task = useSelector(state => state.tasks[taskId])
	const dispatch = useDispatch()

	function createTaskClickHandler() {
		dispatch({ type: 'createTask', dashboardId, listId, newTaskId: `newTask${+new Date()}` })
	}

	if (task) {
		return (
			<Draggable draggableId={ taskId } index={ index }>
				{ provided => (
					<Container className="task" { ...provided.draggableProps } { ...provided.dragHandleProps } ref={ provided.innerRef }>
						{ task.title }
						{
							task.modules.map((module, index) => {
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
			<Container createTaskButton className="task create-task-button" onClick={ createTaskClickHandler }>
				Add Task
			</Container>
		)
	}
}

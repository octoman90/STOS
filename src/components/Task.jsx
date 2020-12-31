import React from 'react'
import styled, { css } from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { dispatch as busDispatch } from 'use-bus'

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

function upsyncTask(data, dispatch) {
	let options = {
		method: "POST",
		body: JSON.stringify(data)
	}

	return fetch('/api/syncTask', options)
		.then(response => {
			if (response.ok && response.status === 200) {
				return response.json()
			} else {
				throw new Error(response.statusText)
			}
		})
		.then(data => {
			dispatch({
				type: 'setTask',
				task: data || {}
			})
		})
		.catch(err => {
			console.log('error', err.message)
		})
}

export default function Task({ taskID, index, listID }) {
	const tasks = useSelector(state => state.tasks)
	const task = useSelector(state => state.tasks[taskID])
	const dispatch = useDispatch()

	function taskClickHandler() {
		busDispatch({ type: 'showTaskModal', taskID })
	}

	function createTaskClickHandler() {
		let listTasks = Object.values(tasks).filter(task => task.list == listID)
		let index = listTasks.length ? listTasks.sort((a, b) => b.index - a.index)[0].index + 1 : 0

		upsyncTask({ title: "New Task", list: listID, index }, dispatch)
	}

	if (task) {
		return (
			<Draggable draggableId={ taskID } index={ index }>
				{ provided => (
					<Container className="task" { ...provided.draggableProps } { ...provided.dragHandleProps } ref={ provided.innerRef } onClick={ taskClickHandler }>
						{ task.title }
						{ task.modules && 
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

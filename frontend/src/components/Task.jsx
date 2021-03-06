import React                        from 'react'
import styled, { css }              from 'styled-components'
import { Draggable }                from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { dispatch as busDispatch }  from 'use-bus'
import PlusIcon                     from '@material-ui/icons/Add'

import Description from './taskModules/Description.jsx'
import Poll        from './taskModules/Poll'
import Timer       from './taskModules/Timer.jsx'
import UserList    from './taskModules/UserList.jsx'
import controller  from '../controller'

const modules = {
	description: Description,
	poll:        Poll,
	timer:       Timer,
	userList:    UserList
}

const Container = styled.div`
	border-top: 1px solid #ddd;
	background-color: #fff;
	padding: 0.5em;
	display: flex;
	flex-direction: column;

	${props => props.createTaskButton && css`
		color: #777;
		align-items: center;
		cursor: pointer;
	`}
`

function RealTask({ taskID, index }) {
	const task = useSelector(state => state.tasks[taskID])

	function clickHandler() {
		busDispatch({ type: 'showTaskModal', taskID })
	}

	return (
		<Draggable draggableId={ taskID } index={ index }>
			{(provided) => (
				<Container { ...provided.draggableProps } { ...provided.dragHandleProps } ref={ provided.innerRef } onClick={ clickHandler }>
					{ task.title }
					{ task.modules &&
						task.modules.map((moduleJSON) => {
							const module = JSON.parse(moduleJSON)

							return React.createElement(
								modules[module.type],
								{
									key: module.id,
									meta: module,
									full: false,
									task
								}
							)
						})
					}
				</Container>
			)}
		</Draggable>
	)
}

function TaskPlaceholder({ listID }) {
	const tasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()

	function clickHandler() {
		const listTasks = Object.values(tasks).filter(task => task.list === listID)
		const index = listTasks.length
			? listTasks.sort((a, b) => b.index - a.index)[0].index + 1
			: 0

		controller.createTask(listID, index, dispatch)
	}

	return (
		<Container createTaskButton onClick={ clickHandler }>
			<PlusIcon />
		</Container>
	)
}

export default function Task({ taskID, index, listID }) {
	if (taskID) {
		return <RealTask taskID={ taskID } index={ index } />
	} else {
		return <TaskPlaceholder listID={ listID } />
	}
}

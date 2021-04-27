import React, { useEffect } 		from 'react'
import styled, { css } 				from 'styled-components'
import { Droppable } 				from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'
import useBus, {
	dispatch as busDispatch
} 									from 'use-bus'
import DeleteIcon 					from '@material-ui/icons/Delete'
import EditIcon 					from '@material-ui/icons/Edit'
import PlusIcon 					from '@material-ui/icons/Add'

import Task 			from './Task.jsx'
import controller 		from '../controller'

const Container = styled.div`
	background-color: #fff;
	padding: 0.5em;
	margin: 0.5em;
	width: 20em;
`

const ListHeader = styled.div`
	padding: 1em 0.5em 1.5em 0.5em;
	font-weight: bold;
	cursor: default;

	${props => props.createListButton && css`
		color: #777;
		text-align: center;
		cursor: pointer;
	`}
`

function RealList({ listID, editable }) {
	const list = useSelector(state => state.lists[listID])
	const tasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()

	function titleEditClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'listName',
			listID: list.id,
			caption: 'Enter the list title:'
		})
	}

	function deleteClickHandler() {
		controller.deleteList(list, dispatch)
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			if (params.field !== 'listName' || params.listID !== list.id) return

			controller.renameList(list, params.value, dispatch)
		},
		[list, dispatch]
	)

	useEffect(() => {
		controller.downsyncTasks(listID, dispatch)
	}, [listID, dispatch])

	return (
		<Container>
			<ListHeader>
				{ list.title }
				{ editable &&
					<>
						<EditIcon className="hover-visible" onClick={ titleEditClickHandler } style={{ verticalAlign: "bottom", cursor: 'pointer' }} />
						<DeleteIcon className="hover-visible" onClick={ deleteClickHandler } style={{ verticalAlign: "bottom", cursor: 'pointer' }} />
					</>
				}
			</ListHeader>
			<Droppable droppableId={ list.id }>
				{ (provided) =>
					<div ref={ provided.innerRef } { ...provided.droppableProps }>
						{
							Object.values(tasks)
								.sort((a, b) => a.index - b.index)
								.map((task) => {
									if (list.id !== task.list) return

									return <Task key={ task.id } taskID={ task.id } index={ task.index } />
								})
						}
						{ provided.placeholder }
					</div>
				}
			</Droppable>

			{ editable &&
				<Task listID={ list.id } />
			}
		</Container>
	)
}

function ListPlaceholder({ dashboardID }) {
	const dispatch = useDispatch()

	return (
		<Container onClick={ () => controller.createList(dashboardID, dispatch) }>
			<ListHeader createListButton>
				<PlusIcon />
			</ListHeader>
		</Container>
	)
}

export default function List({ listID, dashboardID, editable }) {
	if (listID) {
		return <RealList listID={ listID } editable={ editable } />
	} else {
		return <ListPlaceholder dashboardID={ dashboardID } />
	}
}

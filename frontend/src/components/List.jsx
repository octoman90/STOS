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

export default function List({ listID, dashboardID, currentUserCanEdit }) {
	const list = useSelector(state => state.lists[listID])
	const tasks = useSelector(state => state.tasks)
	const dispatch = useDispatch()

	function createListClickHandler() {
		controller.createList(dashboardID, dispatch)
	}

	useEffect(() => {
		controller.downsyncTasks(listID, dispatch)
	}, [listID, dispatch])

	function titleEditClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'listName',
			listID,
			caption: 'Enter the list title:'
		})
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			if (params.field === 'listName' && params.listID === listID) {
				controller.renameList(list, params.value, dispatch)
			}
		},
		[list, listID, dispatch],
	)

	function deleteClickHandler() {
		controller.deleteList(list, dispatch)
	}

	if (list) {
		return (
			<Container>
				<ListHeader>
					{ list.title }
					{ currentUserCanEdit &&
						<EditIcon className="hover-visible" onClick={ titleEditClickHandler } style={{ verticalAlign: "bottom", cursor: 'pointer' }} />
					}
					{ currentUserCanEdit &&
						<DeleteIcon className="hover-visible" onClick={ deleteClickHandler } style={{ verticalAlign: "bottom", cursor: 'pointer' }} />
					}
				</ListHeader>
				<Droppable droppableId={ listID }>
					{ provided => (
						<div ref={ provided.innerRef } { ...provided.droppableProps }>
							{
								Object.values(tasks).sort((a, b) => a.index - b.index).map(task => {
									return listID === task.list ? <Task key={ task.id } taskID={ task.id } index={ task.index } /> : null
								})
							}
							{ provided.placeholder }
						</div>
					)}
				</Droppable>

				{ currentUserCanEdit &&
					<Task listID={ listID } />
				}
			</Container>
		)
	} else {
		return (
			<Container onClick={ createListClickHandler }>
				<ListHeader createListButton>
					<PlusIcon />
				</ListHeader>
			</Container>
		)
	}
}

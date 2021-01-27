import React 		from 'react'
import styled 		from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import EditIcon 	from '@material-ui/icons/Edit'
import useBus 		from 'use-bus'
import {
	useDispatch
} 					from 'react-redux'
import {
	dispatch as busDispatch
} 					from 'use-bus'

import controller 	from '../../controller'

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid #777;
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
`

export default function Description({ meta, task, full }) {
	const dispatch = useDispatch()

	function editClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'moduleDescription',
			moduleID: meta.id,
			dt: 'text'
		})
	}

	useBus(
		'submitTextEditModal',
		({ field, moduleID, value }) => {
			// eslint-disable-next-line
			if (field == 'moduleDescription' && moduleID == meta.id) {
				controller.editTaskModule(task, meta.id, value, dispatch)
			}
		},
		[task, meta, dispatch],
	)

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	if (full) {
		return (
			<Container>
				{ meta.content
					? meta.content
					: "Press the pencil icon on the right to set the description."
				}
				<div>
					<EditIcon onClick={ editClickHandler } />
					<DeleteIcon onClick={ deleteClickHandler } />
				</div>
			</Container>
		)
	} else {
		return (null)
	}
}

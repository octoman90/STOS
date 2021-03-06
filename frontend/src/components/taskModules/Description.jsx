import React                from 'react'
import styled               from 'styled-components'
import DeleteIcon           from '@material-ui/icons/Delete'
import EditIcon             from '@material-ui/icons/Edit'
import { useDispatch }      from 'react-redux'
import useBus, {
	dispatch as busDispatch
}                           from 'use-bus'

import controller from '../../controller'

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid #777;
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
	cursor: default;
`

export default function Description({ meta, task, full, editable }) {
	const dispatch = useDispatch()

	function editClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'moduleDescription',
			moduleID: meta.id,
			dt: 'text',
			caption: 'Enter the new description:'
		})
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			if (!full) return
			if (params.field !== 'moduleDescription' || params.moduleID !== meta.id) return

			controller.editTaskModule(task, meta.id, { action: 'replace', value: params.value }, dispatch)
		},
		[task, meta, dispatch]
	)

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	if (full) {
		return (
			<Container>
				{ meta.content ?? "Press the pencil icon on the right to set the description." }
				{ editable &&
					<div>
						<EditIcon onClick={ editClickHandler } style={{ cursor: 'pointer' }} />
						<DeleteIcon onClick={ deleteClickHandler } style={{ cursor: 'pointer' }} />
					</div>
				}
			</Container>
		)
	} else {
		return null
	}
}

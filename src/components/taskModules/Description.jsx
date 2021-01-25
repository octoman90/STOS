import React 		from 'react'
import styled 		from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import EditIcon 	from '@material-ui/icons/Edit'
import {
	useDispatch
} 					from 'react-redux'

import controller 	from '../../controller'

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid #777;
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
`

export default function Description({ meta, task, index, full }) {
	const dispatch = useDispatch()

	function deleteClickHandler() {
		controller.deleteTaskModule(task, index, dispatch)
	}

	if (full) {
		return (
			<Container>
				{ meta.content
					? meta.content
					: "Press the pencil icon on the right to set the description."
				}
				<div>
					<EditIcon />
					<DeleteIcon onClick={ deleteClickHandler } />
				</div>
			</Container>
		)
	} else {
		return (null)
	}
}

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
	background-color: rgba(0, 255, 0, 0.1);
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
`

export default function Timer({ meta, task, index, full }) {
	const dispatch = useDispatch()

	function deleteClickHandler() {
		controller.deleteTaskModule(task, index, dispatch)
	}

	return (
		<Container>
			{ meta.content }
			{ full &&
				(
					<div>
						<EditIcon />
						<DeleteIcon onClick={ deleteClickHandler } />
					</div>
				)
			}
		</Container>
	)
}

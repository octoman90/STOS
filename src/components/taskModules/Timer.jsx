import React 	from 'react'
import styled 	from 'styled-components'
import DeleteIcon 					from '@material-ui/icons/Delete'
import EditIcon 					from '@material-ui/icons/Edit'

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid #777;
	background-color: rgba(0, 255, 0, 0.1);
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
`

export default function Timer({ meta, full }) {
	if (full) {
		return (
			<Container>
				{ meta.content }
				<div>
					<EditIcon />
					<DeleteIcon />
				</div>
			</Container>
		)
	} else {
		return (null)
	}
}

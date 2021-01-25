import React 	from 'react'
import styled 	from 'styled-components'
import DeleteIcon 					from '@material-ui/icons/Delete'
import EditIcon 					from '@material-ui/icons/Edit'

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid #777;
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
`

export default function Description({ meta, full }) {
	if (full) {
		return (
			<Container>
				{ meta.content
					? meta.content
					: "Press the pencil icon on the right to set the description."
				}
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

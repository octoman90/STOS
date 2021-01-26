import React 	from 'react'
import styled 	from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import {
	useDispatch
} 				from 'react-redux'

import controller 	from '../../controller'

const Container = styled.div`
	display: block;
	margin: 0.5em 0;
	padding: 0.5em 0;
	display: flex;
`

const BarContainer = styled.div`
	display: block;
	width: 100%
`

function PollBar({ votes, total, visibleVotes }) {
	return (null)
}

export default function UserList({ meta, task, index, full }) {
	const dispatch = useDispatch()

	function deleteClickHandler() {
		controller.deleteTaskModule(task, index, dispatch)
	}

	if (full) {
		return (
			<Container>
				<BarContainer>
					{
						Object.entries(meta.content.votes).map(([name, votes]) => {
							return <PollBar votes={ votes } total={ meta.content.voted.length } visibleVotes={ false }>{ name }</PollBar>
						})
					}
				</BarContainer>
				<DeleteIcon onClick={ deleteClickHandler } />
			</Container>
		)
	} else {
		return (null)
	}
}

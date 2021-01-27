import React 	from 'react'
import styled 	from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import {
	useSelector,
	useDispatch
} 					from 'react-redux'

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

function PollBar({ votes, name, visibleVotes }) {
	return (
		<div>
			{ name }
			{ visibleVotes ? votes : null }
		</div>
	)
}

export default function UserList({ meta, task, full }) {
	const dispatch = useDispatch()
	const cUser = useSelector(state => state.user)

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	let visibleVotes = meta.content.voted.includes(cUser.id)

	function voteClickHandler(alreadyVoted, index) {
		console.log(cUser.name, 'voted for', index, ';', alreadyVoted)
		if (alreadyVoted) {
			return
		}
		meta.content.voted.push(cUser.id)

		meta.content.votes[index][1]++
		controller.editTaskModule(task, meta.id, { action: 'replace', meta }, dispatch)
	}

	if (full) {
		return (
			<Container>
				<BarContainer>
					{
						meta.content.votes.map(([name, votes], index) => {
							return <PollBar key={ index } votes={ votes } visibleVotes={ visibleVotes } name={ name } onClick={ console.log } />
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

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

function PollBar({ votes, name, visibleVotes, onClick }) {
	return (
		<div onClick={ onClick }>
			{ name } { visibleVotes ? votes : null }
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
		if (alreadyVoted) {
			return
		}

		let newContent = JSON.parse(JSON.stringify(meta.content))
		newContent.voted.push(cUser.id)
		newContent.votes[index][1]++

		controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
	}

	if (full) {
		return (
			<Container>
				<BarContainer>
					{
						meta.content.votes.map(([name, votes], index) => {
							return <PollBar key={ index } votes={ votes } visibleVotes={ visibleVotes } name={ name } onClick={ () => voteClickHandler(visibleVotes, index) } />
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

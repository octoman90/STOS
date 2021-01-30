import React 		from 'react'
import styled 		from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import EditIcon 	from '@material-ui/icons/Edit'
import PlusIcon 	from '@material-ui/icons/Add'
import {
	useSelector,
	useDispatch
} 					from 'react-redux'

import controller 	from '../../controller'

const Container = styled.div`
	display: block;
	margin: 0.5em 0;
	padding: 0.5em 0;
	display: grid;
	grid-template-columns: 1fr 2em;
`

const BarContainer = styled.div`
	display: block;
	width: 100%
`

function PollBar({ votes, name, visibleVotes, addButton, onClick }) {
	if (addButton) {
		return (
			<div onClick={ onClick }>
				+
			</div>
		)
	} else {
		return (
			<div onClick={ onClick }>
				{ name } { visibleVotes ? votes : null }
				<EditIcon className="hover-visible" />
				<DeleteIcon className="hover-visible" />
			</div>
		)
	}
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

	function addOptionClickHandler() {

	}

	if (full) {
		return (
			<Container>
				<b>{ meta.content.title }</b>
				<EditIcon />
				<BarContainer>
					{
						meta.content.votes.map(([name, votes], index) => {
							return <PollBar key={ index } votes={ votes } visibleVotes={ visibleVotes } name={ name } onClick={ () => voteClickHandler(visibleVotes, index) } />
						})
					}
					<PlusIcon />
				</BarContainer>
				<DeleteIcon onClick={ deleteClickHandler } />
			</Container>
		)
	} else {
		return (null)
	}
}

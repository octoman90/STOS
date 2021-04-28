import React                from 'react'
import styled               from 'styled-components'
import DeleteIcon           from '@material-ui/icons/Delete'
import EditIcon             from '@material-ui/icons/Edit'
import PlusIcon             from '@material-ui/icons/Add'
import {
	useSelector,
	useDispatch
}                           from 'react-redux'
import useBus, {
	dispatch as busDispatch
}                           from 'use-bus'

import controller from '../../controller'

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

const PB = styled.div`
	display: flex;
	cursor: pointer;
`

function PollBar({ task, poll, votes, name, index, editable}) {
	const cUserID = useSelector(state => state.user.id)
	const visibleVotes = poll.content.voted.includes(cUserID)
	const dispatch = useDispatch()

	function voteClickHandler() {
		if (visibleVotes) return

		let newContent = { ...poll.content }
		newContent.voted.push(cUserID)
		newContent.votes[index][1]++

		controller.editTaskModule(task, poll.id, { action: 'replace', value: newContent }, dispatch)
	}

	function renameClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'modulePollOption',
			moduleID: poll.id,
			innerIndex: index,
			dt: 'text',
			caption: 'Enter the new option:'
		})
	}

	function deleteClickHandler() {
		let newContent = { ...poll.content }
		newContent.votes.splice(index, 1)

		controller.editTaskModule(task, poll.id, { action: 'replace', value: newContent }, dispatch)
	}

	return (
		<PB>
			<div onClick={ voteClickHandler }>{ name } { visibleVotes && votes }</div>
			{ editable &&
				<>
					<EditIcon className="hover-visible" onClick={ renameClickHandler } />
					<DeleteIcon className="hover-visible" onClick={ deleteClickHandler } />
				</>
			}
		</PB>
	)
}

export default function Poll({ meta, task, full, editable }) {
	const dispatch = useDispatch()

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	function addOptionClickHandler() {
		let newContent = { ...meta.content }
		newContent.votes.push(['Another option', 0])

		controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			if (!full) return
			if (params.field !== 'modulePollOption' || params.moduleID !== meta.id) return

			const newContent = { ...meta.content }
			newContent.votes[params.innerIndex][0] = params.value

			controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
		},
		[task, meta, dispatch],
	)

	function renameClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'modulePollTitle',
			moduleID: meta.id,
			dt: 'text',
			caption: 'Enter the new question:'
		})
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			if (!full) return
			if (params.field !== 'modulePollTitle' || params.moduleID !== meta.id) return

			const newContent = { ...meta.content }
			newContent.title = params.value

			controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
		},
		[task, meta, dispatch]
	)

	if (full) {
		return (
			<Container>
				<b style={{ cursor: 'default' }} >{ meta.content.title }</b>
				{ editable
					? <EditIcon onClick={ renameClickHandler } style={{ cursor: 'pointer' }} />
					: <div></div>
				}
				<BarContainer>
					{
						meta.content.votes.map(([name, votes], index) => {
							return <PollBar key={ name } task={ task } poll={ meta } index={ index } votes={ votes } editable={ editable } name={ name } />
						})
					}
					{ editable &&
						<PlusIcon onClick={ addOptionClickHandler } style={{ cursor: 'pointer' }} />
					}
				</BarContainer>
				{ editable
					? <DeleteIcon onClick={ deleteClickHandler } style={{ cursor: 'pointer' }} />
					: <div></div>
				}
			</Container>
		)
	} else {
		return null
	}
}

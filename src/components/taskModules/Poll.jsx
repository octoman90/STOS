import React 		from 'react'
import styled 		from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import EditIcon 	from '@material-ui/icons/Edit'
import PlusIcon 	from '@material-ui/icons/Add'
import {
	useSelector,
	useDispatch
} 					from 'react-redux'
import useBus, {
	dispatch as busDispatch
} 					from 'use-bus'

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

const PB = styled.div`
	display: flex;
	cursor: pointer;
`

function PollBar({ votes, name, visibleVotes, addButton, index, onVoteClick, onRenameClick, onDeleteClick, currentUserCanEdit}) {
	return (
		<PB>
			<div onClick={ () => !visibleVotes ? onVoteClick(visibleVotes, index) : null }>{ name } { visibleVotes ? votes : null }</div>
			{ currentUserCanEdit &&
				<EditIcon className="hover-visible" onClick={ () => onRenameClick(index) } />
			}
			{ currentUserCanEdit &&
				<DeleteIcon className="hover-visible" onClick={ () => onDeleteClick(index) } />
			}
		</PB>
	)
}

export default function Poll({ meta, task, full, currentUserCanEdit }) {
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
		let newContent = JSON.parse(JSON.stringify(meta.content))
		newContent.votes.push(['Another option', 0])

		controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
	}

	function deleteOptionClickHandler(index) {
		let newContent = JSON.parse(JSON.stringify(meta.content))
		newContent.votes.splice(index, 1)

		controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
	}

	function renameOptionClickHandler(index) {
		busDispatch({
			type: 'showTextEditModal',
			field: 'modulePollOption',
			moduleID: meta.id,
			innerIndex: index,
			dt: 'text',
			caption: 'Enter the new option:'
		})
	}

	useBus(
		'submitTextEditModal',
		({ field, moduleID, innerIndex, value }) => {
			// eslint-disable-next-line
			if (full && field == 'modulePollOption' && moduleID == meta.id) {
				let newContent = JSON.parse(JSON.stringify(meta.content))
				newContent.votes[innerIndex][0] = value

				controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
			}
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
		({ field, moduleID, value }) => {
			// eslint-disable-next-line
			if (full && field == 'modulePollTitle' && moduleID == meta.id) {
				let newContent = JSON.parse(JSON.stringify(meta.content))
				newContent.title = value

				controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
			}
		},
		[task, meta, dispatch],
	)

	if (full) {
		return (
			<Container>
				<b style={{ cursor: 'default' }} >{ meta.content.title }</b>
				{ currentUserCanEdit
					? <EditIcon onClick={ renameClickHandler } style={{ cursor: 'pointer' }} />
					: <div></div>
				}
				<BarContainer>
					{
						meta.content.votes.map(([name, votes], index) => {
							return <PollBar key={ index } index={ index } votes={ votes } currentUserCanEdit={ currentUserCanEdit } visibleVotes={ visibleVotes } name={ name } onVoteClick={ voteClickHandler } onRenameClick={ renameOptionClickHandler } onDeleteClick={ deleteOptionClickHandler } />
						})
					}
					{ currentUserCanEdit &&
						<PlusIcon onClick={ addOptionClickHandler } style={{ cursor: 'pointer' }} />
					}
				</BarContainer>
				{ currentUserCanEdit
					? <DeleteIcon onClick={ deleteClickHandler } style={{ cursor: 'pointer' }} />
					: <div></div>
				}
			</Container>
		)
	} else {
		return (null)
	}
}

import React 		from 'react'
import styled 		from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import {
	useDispatch
} 					from 'react-redux'
import useBus, {
	dispatch as busDispatch
} 					from 'use-bus'

import controller 	from '../../controller'

const Container = styled.div`
	margin: 0.5em 0;
	padding: 0.5em 0;
	gap: 0.5em;
	display: flex;
	justify-content: space-between;
`

const U = styled.div`
	padding: 0.5em;
	background-color: #fff;
	border-radius: 0.3em;
	width: 7em;
	display: inline;
	border: 1px solid #777;
`

export default function UserList({ meta, task, full, currentUserCanEdit }) {
	const dispatch = useDispatch()

	function plusClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'moduleUserList',
			moduleID: meta.id,
			dt: 'text',
			caption: 'Enter user\'s name:'
		})
	}

	useBus(
		'submitTextEditModal',
		({ field, moduleID, value }) => {
			// eslint-disable-next-line
			if (full && field == 'moduleUserList' && moduleID == meta.id) {
				controller.editTaskModule(task, meta.id, { action: 'push', value }, dispatch)
			}
		},
		[task, meta, dispatch],
	)

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	function userClickHandler(index) {
		if (!full || !currentUserCanEdit) {
			return
		}

		let newContent = JSON.parse(JSON.stringify(meta.content))
		newContent.splice(index, 1)

		controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
	}

	return (
		<Container>
			<div>
				{ (meta.content || []).map((user, index) => <U key={ index } onClick={ () => userClickHandler(index) }>{ user[1] }</U>)}
				{ full && currentUserCanEdit &&
					<U style={{ width: '2em' }} onClick={ plusClickHandler }>+</U>
				}
			</div>
			{ full && currentUserCanEdit &&
				(
					<div>
						<DeleteIcon onClick={ deleteClickHandler } />
					</div>
				)
			}
		</Container>
	)
}

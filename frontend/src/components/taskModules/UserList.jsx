import React                from 'react'
import styled, { css }      from 'styled-components'
import DeleteIcon           from '@material-ui/icons/Delete'
import { useDispatch }      from 'react-redux'
import useBus, {
	dispatch as busDispatch
}                           from 'use-bus'

import controller from '../../controller'

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

	${props => props.full && css`
		cursor: not-allowed;
	`}
`

export default function UserList({ meta, task, full, editable }) {
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
		(params) => {
			if (!full) return
			if (params.field !== 'moduleUserList' || params.moduleID !== meta.id) return

			controller.editTaskModule(task, meta.id, { action: 'push', value: params.value }, dispatch)
		},
		[task, meta, dispatch]
	)

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	function userClickHandler(index) {
		if (!full) return
		if (!editable) return

		let newContent = { ...meta.content }
		newContent.splice(index, 1)

		controller.editTaskModule(task, meta.id, { action: 'replace', value: newContent }, dispatch)
	}

	return (
		<Container>
			<div>
				{ meta.content?.map((user, index) => {
					return <U key={ index } onClick={ () => userClickHandler(index) } full={ full }>{ user[1] }</U>
				})}
				{ full && editable &&
					<U style={{ width: '2em', cursor: 'pointer' }} onClick={ plusClickHandler }>+</U>
				}
			</div>
			{ full && editable &&
				<div>
					<DeleteIcon onClick={ deleteClickHandler } style={{ cursor: 'pointer' }} />
				</div>
			}
		</Container>
	)
}

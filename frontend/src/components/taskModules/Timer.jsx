import React, {
	useReducer,
	useEffect
}                           from 'react'
import styled               from 'styled-components'
import DeleteIcon           from '@material-ui/icons/Delete'
import EditIcon             from '@material-ui/icons/Edit'
import useBus               from 'use-bus'
import { useDispatch }      from 'react-redux'
import {
	dispatch as busDispatch
}                           from 'use-bus'

import controller from '../../controller'

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid #777;
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
	background-color: rgba(0, 255, 0, 0.1);
	cursor: default;
`

function calculateRemainingTime(to) {
	let s = +new Date()
	let f = Date.parse(to)
	let diff = f - s

	if (diff < 0) return '0'

	let days = Math.floor(diff / 8.64e7)
	let hours = Math.floor((diff - days * 8.64e7) / 3.6e6)
	let minutes = Math.floor((diff - days * 8.64e7 - hours * 3.6e6) / 6e4)

	return `${days}D ${hours}H ${minutes}M`
}

export default function Description({ meta, task, full, editable }) {
	const dispatch = useDispatch()
	const [, forceUpdate] = useReducer(x => x + 1, 0)

	function editClickHandler() {
		busDispatch({
			type: 'showTextEditModal',
			field: 'moduleTimer',
			moduleID: meta.id,
			dt: 'datetime',
			caption: 'Enter the new due date:'
		})
	}

	useBus(
		'submitTextEditModal',
		(params) => {
			if (!full) return
			if (params.field !== 'moduleTimer' || params.moduleID !== meta.id) return

			controller.editTaskModule(task, meta.id, { action: 'replace', value: params.value }, dispatch)
		},
		[task, meta, dispatch]
	)

	/* Automatically update time */
	useEffect(() => {
		let interval = setInterval(forceUpdate, 5e4)

		return () => clearInterval(interval)
	}, [forceUpdate])

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	return (
		<Container>
			{ meta.content
				? calculateRemainingTime(meta.content)
				: "Press the pencil icon on the right to set the deadline."
			}
			{ full && editable &&
				<div>
					<EditIcon onClick={ editClickHandler } style={{ cursor: 'pointer' }} />
					<DeleteIcon onClick={ deleteClickHandler } style={{ cursor: 'pointer' }} />
				</div>
			}
		</Container>
	)
}

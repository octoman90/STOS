import React 		from 'react'
import styled 		from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import EditIcon 	from '@material-ui/icons/Edit'
import useBus 		from 'use-bus'
import {
	useDispatch
} 					from 'react-redux'
import {
	dispatch as busDispatch
} 					from 'use-bus'

import controller 	from '../../controller'

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid #777;
	margin: 0.5em 0;
	display: flex;
	justify-content: space-between;
	background-color: rgba(0, 255, 0, 0.1)
`

export default function Description({ meta, task, index, full }) {
	const dispatch = useDispatch()
	let waitingForEdit = false

	function editClickHandler() {
		waitingForEdit = true
		busDispatch({
			type: 'showTextEditModal',
			field: 'moduleTimer',
			dt: 'datetime'
		})
	}

	useBus(
		'submitTextEditModal',
		({ field, value }) => {
			if (field == 'moduleTimer' && waitingForEdit) {
				waitingForEdit = false
				controller.editTaskModule(task, index, value, dispatch)
			}
		},
		[task, index, dispatch],
	)

	function deleteClickHandler() {
		controller.deleteTaskModule(task, index, dispatch)
	}

	function calculateRemainingTime(to) {
		let s = +new Date()
		let f = Date.parse(to)
		let diff = f - s
		if (diff >= 0) {
			let days = Math.floor(diff / 8.64e7)
			let hours = Math.floor((diff - days * 8.64e7) / 3.6e6)
			let minutes = Math.floor((diff - days * 8.64e7 - hours * 3.6e6) / 6e4)

			return `${days}D ${hours}H ${minutes}M`
		} else {
			return `0`
		}
	}

	return (
		<Container>
			{ meta.content
				? calculateRemainingTime(meta.content)
				: "Press the pencil icon on the right to set the deadline."
			}
			{ full &&
				(
					<div>
						<EditIcon onClick={ editClickHandler } />
						<DeleteIcon onClick={ deleteClickHandler } />
					</div>
				)
			}
		</Container>
	)
}

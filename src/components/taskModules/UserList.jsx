import React 		from 'react'
import styled 		from 'styled-components'
import DeleteIcon 	from '@material-ui/icons/Delete'
import {
	useDispatch
} 					from 'react-redux'

import controller 	from '../../controller'

const Container = styled.div`
	display: block;
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

export default function UserList({ meta, task, full }) {
	const dispatch = useDispatch()

	function deleteClickHandler() {
		controller.deleteTaskModule(task, meta.id, dispatch)
	}

	return (
		<Container>
			<div>
				{ (meta.content || []).map((user, index) => <U key={ index }>{ user }</U>)}
				{ full &&
					<U style={{ width: '2em' }}>+</U>
				}
			</div>
			{ full &&
				(
					<div>
						<DeleteIcon onClick={ deleteClickHandler } />
					</div>
				)
			}
		</Container>
	)
}

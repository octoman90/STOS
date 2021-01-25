import React 	from 'react'
import styled 	from 'styled-components'

const Container = styled.div`
	display: block;
	margin: 0.5em 0;
	padding: 0.5em 0;
	display: flex;
`
export default function UserList({ meta, full }) {
	if (full) {
		return (
			<Container>
				poll
			</Container>
		)
	} else {
		return (null)
	}
}

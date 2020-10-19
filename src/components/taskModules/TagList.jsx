import React from 'react'
import styled from 'styled-components'


const Container = styled.div`
	display: flex;
	align-items: flex-start;
	margin: 0.5em 0;
	gap: 0.5em;
`

const Tag = styled.div`
	padding: 0.1em 0.5em;
	border: 1px solid #ccc;
	border-radius: 0.5em;
	opacity: 0.7;
`

export default function TagList({ meta, full }) {
	return (
		<Container>
			{
				meta.content.map((tag, index) => (
					<Tag key={ index } className={ `label-${tag}` }>#{ tag }</Tag>
				))
			}
		</Container>
	)
}

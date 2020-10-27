import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
	background: #f8f8f8;
	height: 7em;
	width: 13em;
	padding: 0.5em;
	box-sizing: border-box;
` 

export default function DashboardBanner({ meta }) {
	return (
		<Container>
			{ meta.title }
		</Container>
	)
}

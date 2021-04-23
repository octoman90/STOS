import React from 'react'
import styled from 'styled-components'

const Info = styled.div`
	display: flex;
	flex-direction: column;
	user-select: none;
`

const Header = styled.div`
	font-size: 3em;
`

export default function LandingInfo() {
	return (
		<Info>
			<Header>STOS</Header>
			<div>
				STOS Team Organisation System is a tool
			</div>
			<div>
				for effective management of your team workflow.
			</div>
		</Info>
	)
}

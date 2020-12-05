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

const LastLine = styled.div`
	margin-top: 1em;
`

const Link = styled.a`
	color: #fff;
	text-decoration: underline;
`

export default function LandingInfo() {
	return (
		<Info>
			<Header>STOS</Header>
			<div>
				STOS Team Organisation System is an open-source tool
			</div>
			<div>
				for managing your team's workflow.
			</div>
			<LastLine>
				Check out project's <Link href="https://gitlab.com/man90/stos" target="_blank">GitLab page</Link>.
			</LastLine>
		</Info>
	)
}

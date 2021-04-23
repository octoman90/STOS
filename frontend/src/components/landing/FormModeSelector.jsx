import styled, { css } from 'styled-components'

export default styled.span`
	text-align: center;
	cursor: pointer;

	${({active}) => active && css`
		opacity: 1;
		border-bottom: 0.15em solid rgb(93, 162, 199);
		cursor: default;
	`}
`

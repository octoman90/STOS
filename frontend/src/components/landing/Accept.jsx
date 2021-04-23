import React from 'react'
import styled from 'styled-components'

const Input = styled.input`
	vertical-align: bottom;
`
const Label = styled.label`
	font-size: 0.8rem;
`

export default function Accept({ inputChangeHandler, setFormData }) {
	return (
		<div>
			<Input type="checkbox" id="accept-checkbox" onChange={ e => inputChangeHandler("accepted", e.target.checked, setFormData) } />
			<Label htmlFor="accept-checkbox">I accept</Label>
		</div>
	)
}

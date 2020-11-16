import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import Description from './taskModules/Description.jsx'
import TagList from './taskModules/TagList.jsx'

const modules = {
	description: Description,
	tagList: TagList
}

const Container = styled.div`
	background-color: #fff;
	padding: 1em;
	height: 70vh;
	width: 35vw;
`

export default function TaskModal({ taskId }) {
	const task = useSelector(state => state.tasks[taskId])

	return (
		<Container>
			<h2>{ task.title }</h2>
			{
				task.modules.map((module, index) => {
					return React.createElement(
						modules[module.type], 
						{
							key: index, 
							meta: module, 
							full: true
						}
					)
				})
			}
		</Container>
	)
}

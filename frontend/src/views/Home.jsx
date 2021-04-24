import React, { useEffect } 		from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled 						from 'styled-components'
import { useNavigate } 				from 'react-router-dom'
import useBus 						from 'use-bus'

import Header 			from '../components/Header.jsx'
import DashboardBanner 	from '../components/DashboardBanner.jsx'
import controller		from '../controller'

const HomeRoot = styled.div`
	height: 100%;

	display: flex;
	gap: 1em;
	padding: 2em;
`

export default function Home() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const dashboards = useSelector(state => state.dashboards)

	useBus(
		'loggedOut',
		() => navigate('/')
	)

	useEffect(() => {
		document.title = "STOS Home"
		controller.downsyncDashboards(dispatch)
	}, [dispatch])

	return (
		<div className="layout">
			<Header />
			<HomeRoot>
				{
					Object.entries(dashboards).map(([dashboardID, dashboard]) => {
						return <DashboardBanner key={ dashboardID } meta={ dashboard } />
					})
				}

				<DashboardBanner meta={ {} } />
			</HomeRoot>
		</div>
	)
}

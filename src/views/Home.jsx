import React 			from 'react'
import { useSelector } 	from 'react-redux'
import styled 			from 'styled-components'
import { useNavigate } 	from 'react-router-dom'
import useBus 			from 'use-bus'

import Header 			from '../components/Header.jsx'
import DashboardBanner 	from '../components/DashboardBanner.jsx'

const HomeRoot = styled.div`
	height: 100%;
	background: rgb(93, 162, 199);
	background: linear-gradient(180deg, rgb(93, 162, 199) 0%, rgb(180, 218, 240) 100%);

	display: flex;
	gap: 1em;
	padding: 2em;
` 

export default function Home() {
	const navigate = useNavigate()
	const dashboards = useSelector(state => state.dashboards)

	useBus(
		'notLoggedIn',
		() => navigate('/')
	)

	return (
		<div className="layout">
			<Header />
			<HomeRoot>
				{
					Object.keys(dashboards).map(dashboardId => {
						return <DashboardBanner key={ dashboardId } meta={ dashboards[dashboardId] } />
					})
				}

				<DashboardBanner meta={ {} } />
			</HomeRoot>
		</div>
	)
}

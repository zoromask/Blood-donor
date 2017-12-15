import React, {Component} from 'react';
import Tabs from '../components/Tabs.jsx';
import Tab from '../components/Tab.jsx';
import GMap from '../components/GMap.jsx';

const Dashboard = () => (
	<div className="dashboard-container">
		<div className="topbar">
			<span>Blood Donor Finder</span>
		</div>
		<div className="left-panel">
			<Tabs defaultActiveTabIndex={0}>
				<Tab tabName={'Filter'} linkClassName={'link-class-0'}>
					<p>content 0</p>
				</Tab>
				<Tab tabName={'Information'} linkClassName={'link-class-1'}>
					
				</Tab>
			</Tabs>
		</div>
		<div className="right-panel">
			<GMap></GMap>	
		</div>
	</div>
)
export default Dashboard;
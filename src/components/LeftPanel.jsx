import React, { Component } from 'react';
import InformationTab from './InformationTab.jsx';
import Tabs from './Tabs.jsx';
import Tab from './Tab.jsx';
import FilterTab from './FilterTab.jsx';

import InfoTab from './SignupTab.jsx'

const LeftPanel = (props) => {
	const {isLoggedIn, user, filterAddress, filterRadius, login} = props
	if(isLoggedIn){
		return(
			<Tabs defaultActiveTabIndex={0}>
				<Tab tabName={'Filter'} linkClassName={'link-class-0'}>
					<FilterTab
						filterAddress={filterAddress}
						filterRadius={filterRadius}
					/>
				</Tab>
				<Tab tabName={'Information'} linkClassName={'link-class-1'}>
					<InformationTab {...props} />
				</Tab>
			</Tabs>
		)
	}
	return(
		<InfoTab login={login} isLoggedIn={isLoggedIn}/>
	)
}
export default LeftPanel;
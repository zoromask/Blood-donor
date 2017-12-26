import React, { Component } from 'react';
import InformationTab from './InformationTab.jsx';
import Tabs from './Tabs.jsx';
import Tab from './Tab.jsx';
import FilterTab from './FilterTab.jsx';

import InfoTab from './SignupTab.jsx'

const LeftPanel = (props) => {
	const {isLoggedIn, user, filterAddress, filter, login,
			searchArea, map, currentUser, editDonorInformation} = props
	if (isLoggedIn === null) {
		return (
			<div className="load-wrapp">
				<div className="load-5">
					<div className="ring-2">
						<div className="ball-holder">
							<div className="ball"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	else if(isLoggedIn){
		return(
			<Tabs defaultActiveTabIndex={0}>
				<Tab tabName={'Filter'} linkClassName={'link-class-0'}>
					<FilterTab
						filterAddress={filterAddress}
						map = {map}
						searchArea = {searchArea}
						filterAddress={filterAddress}
						filter={filter}
					/>
				</Tab>
				<Tab tabName={'Information'} linkClassName={'link-class-1'}>
					<InformationTab 
						map = {map}
						currentUser={currentUser}
						editDonorInformation={editDonorInformation}
					/>
				</Tab>
			</Tabs>
		)
	}
	else {
		return  (
			<InfoTab login={login} isLoggedIn={isLoggedIn}/>
		)
	}
}
export default LeftPanel;

import React, {Component} from 'react';

const Topbar = ({isLoggedIn, logout} ) => {
	
	const setLogout = () => {
		if(isLoggedIn)
			return(
				<span className="btn-logout" onClick={logout}> Logout </span>
			)
	}
	return(
		<div className="topbar">
			<span>Blood Donor Finder</span>
			{setLogout()}
		</div>
	);
}


export default Topbar;
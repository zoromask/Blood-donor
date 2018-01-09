import React from 'react';
import Dashboard from '../components/Dashboard.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getUser, getIsLoggedIn, getDonors, getUserInfo} from '../selectors';
import {login, addInfo, updateInfo, filter, getUserByEmail, ggGetCoord} from '../actions';

const mapStateToProps = state => ({
	user: getUser(state),
	isLoggedIn: getIsLoggedIn(state),
	donors: getDonors(state),
	userInfo: getUserInfo(state)
})
const mapDispatchToProps = (dispatch) =>{
	return {
		actions: bindActionCreators({
			login, addInfo, updateInfo, filter, getUserByEmail, ggGetCoord,
		}, dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
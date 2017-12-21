import React from 'react';
import Topbar from '../components/Topbar.jsx';
import { connect } from 'react-redux';
import {logout} from '../actions';
import {getIsLoggedIn} from '../selectors'
const TopbarContainer = (props) => <Topbar {...props} />

const mapStateToProps = state => {
	return{
		isLoggedIn: getIsLoggedIn(state)
	}
	
}
const mapDispatchToProps = (dispatch) =>{
	return {
		logout: () => {
			dispatch(logout())
		}
	}
}
	

export default connect(mapStateToProps, mapDispatchToProps)(TopbarContainer)
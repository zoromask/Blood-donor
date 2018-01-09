import React from 'react';
import Topbar from '../components/Topbar.jsx';
import { connect } from 'react-redux';
import {getIsLoggedIn} from '../selectors'
import {logout} from '../actions';

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
import React from 'react';
import { connect } from 'react-redux';
import {isLogin} from '../actions'
import App from '../components/App.jsx'

const AppContainer = props => <App {...props}/>
const mapStateToProps = (state) => {
	return{
		isLoggedIn: state.login.isLogin,
		user: state.login.user
	}
}
const mapDispatchToProps = (dispatch) => {
	return{
		isLogin: () => {dispatch(isLogin())}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
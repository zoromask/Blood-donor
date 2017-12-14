

import React, {Component} from 'react';
import {connect} from 'react-redux';
import { login } from '../actions'
import {Link} from 'react-router-dom'
import FormLogin from '../components/form_login.jsx'
class Login extends Component{
	constructor(props){
		super(props)
		this.state = {
			username: '',
			password: '',
			remember: true
		}
	}
	componentWillReceiveProps(nextProps){
		console.log(nextProps.loginStatus)
	}
	login(){
		let params = {
			username: this.state.username,
			password: this.state.password
		}
		this.props.login(params)
	}
	render(){
		return(
			<div className="view-signin">
				<form className="form-signin">
					<h2 className="form-signin-heading">Please login</h2>
					<input type="text" className="form-control" name="username" value={this.state.username} placeholder="Email Address" onChange={(e) => {
						this.setState({username: e.target.value})
					}} />
					<input type="password" className="form-control" name="password" value={this.state.password} placeholder="Password" onChange={(e)=>{
						this.setState({password: e.target.value})
					}}/>  
					<label className="checkbox">
			    		<input type="checkbox" value={this.state.remember} id="rememberMe" name="rememberMe" /> Remember me
			  		</label>
			  		<button className="btn btn-lg btn-primary btn-block" type="submit" onClick={(e)=>{
			  			e.preventDefault()
			  			this.login()
			  		}}>Login</button> 
			  		<Link to='/forgot-password'>Forgot password</Link><br/>
			  		<Link to='/register'>Register</Link>
				</form>
				{/*<FormLogin 
					username={this.state.username} 
					password={this.state.password} 
					remember={this.state.remember} 
					login={this.login}/>*/}
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		loginStatus: state.login
	}
}
const mapDispatchToProps = (dispatch) =>{
	return {
		login: (params) => {
			dispatch(login(params))
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
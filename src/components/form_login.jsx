import React, {Component} from 'react';
import {Link} from 'react-router-dom'
const FormLogin = ({login, username, password, remember}) => (
	<form className="form-signin">
		<h2 className="form-signin-heading">Please login</h2>
		<input type="text" className="form-control" name="username" value={username} placeholder="Email Address" required="" />
		<input type="password" className="form-control" name="password" value={password} placeholder="Password" required=""/>  
		<label className="checkbox">
    		<input type="checkbox" value={remember} id="rememberMe" name="rememberMe" /> Remember me
  		</label>
  		<button className="btn btn-lg btn-primary btn-block" type="submit" onClick={(e)=>{
  			e.preventDefault()
  			login()
  		}}>Login</button> 
  		<Link to='/forgot-password'>Forgot password</Link><br/>
  		<Link to='/register'>Register</Link>
  		{/*<button className="btn btn-lg btn-primary btn-block" type="submit">Login</button> */}
	</form>
)
export default FormLogin;


import React, {Component} from 'react';

class ForgotPassword extends Component{

	render(){
		return(
			<form className="forgot-password">
				<h2>Forgot password</h2>
				<input type="text" className="form-control" placeholder="your email"/>
				<button className="btn btn-lg btn-success btn-block">Reset your password</button>
			</form>
		)
	}
	
}

export default ForgotPassword
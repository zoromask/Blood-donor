

import React, {Component} from 'react';
import { renderRoutes } from 'react-router-config'
import TopbarContainer from '../containers/TopbarContainer.jsx'
class App extends Component{
	constructor(props){
		super(props);
	}
	componentWillMount(){
		this.props.isLogin();
	}
	render(){
		const {route} = this.props
		return (
			<div className="container">
				<TopbarContainer />
				{renderRoutes(route.routes)}
			</div>
		)
	}
}
export default App;
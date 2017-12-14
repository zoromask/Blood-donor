

import React, {Component} from 'react';
import { renderRoutes } from 'react-router-config'
class App extends Component{
	render(){
		const {route} = this.props
		return (
			<div className="container">
				{renderRoutes(route.routes)}
			</div>
		)
	}
}
export default App;
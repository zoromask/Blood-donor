import asyncComponent from './async_component.jsx';

import React from 'react';
import { renderRoutes } from 'react-router-config'
import AppContainer from '../containers/AppContainer.jsx';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const routes = [
	// {
	// 	path: '/login',
	// 	component: asyncComponent(() => System.import('../containers/login.jsx')
 //  			.then(module => module.default), { name: 'login' })
	// },
	// {
	// 	path: '/register',
	// 	component: asyncComponent(() => System.import('../containers/register.jsx')
 //  			.then(module => module.default), { name: 'register' })
	// },
	// {
	// 	path: '/forgot-password',
	// 	component: asyncComponent(() => System.import('../containers/forgot_password.jsx')
 //  			.then(module => module.default), { name: 'forgot password' })
	// },
	{
		path: '/',
		component: AppContainer,
		routes:[
			{
				path: '/',
				exact: true,
				component: asyncComponent(
					() => System.import('../containers/dashboard.jsx').then(module => module.default),
					{ name: 'index' }
				)
			}
		]

		
	},
]


const RouteRoot = () =>(
	<Router>
		{renderRoutes(routes)}
	</Router>
)
export default RouteRoot;
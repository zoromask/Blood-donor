import React from 'react';
import ReactDOM from 'react-dom';
import promise from 'redux-promise-middleware'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import RouteRoot from './routes/route_root.jsx';

import './styles/style.scss';

import reducers from './reducers/index';
let store = createStore(
	reducers, 
	applyMiddleware(
		promise(),
		thunkMiddleware
	)
)


ReactDOM.render(
  	<Provider store={store}>
		<RouteRoot />
	</Provider>,
	document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import RouteRoot from './routes/route_root.jsx';

import './styles/style.scss';

import reducers from './reducers/index.jsx';
let store = createStore(
	reducers, 
	applyMiddleware(thunkMiddleware)
)


ReactDOM.render(
  	<Provider store={store}>
		<RouteRoot />
	</Provider>,
	document.getElementById('root')
);
import { combineReducers } from 'redux';

import login from './Login';
import app from './App';

const reducers = combineReducers({
	login: login,
	app: app
})

export default reducers;
import { combineReducers } from 'redux';

const login = (state = {}, action = {}) =>{
	switch(action.type){
		case 'LOGIN':
			return Object.assign({}, state, {
				login: action.data
			})
			break
		default:
			return state
	}
}

const reducers = combineReducers({
	login: login
})

export default reducers;
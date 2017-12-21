import { combineReducers } from 'redux';
const initialState = {
	isLoggedIn: false,
	user: {}
}
const login = (state = initialState, action = {}) =>{
	switch(action.type){
		case 'LOGIN':
			return Object.assign({}, state, {
				isLoggedIn: true,
				user: action.user
			})
			break;
		case 'IS_LOGIN':
			if(action.user){
				return Object.assign({}, state, {
					isLoggedIn: true,
					user: action.user
				})	
			}else{
				return state
			}
			break;
		case 'LOGOUT':
			return Object.assign({}, state, {
				isLoggedIn: false,
				user: {}
			})	
			break;
		default:
			return state
	}
}

const reducers = combineReducers({
	login: login
})

export default reducers;
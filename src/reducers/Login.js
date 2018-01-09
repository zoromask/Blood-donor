const initialState = {
	isLoggedIn: false,
	user: {},
}
export default (state = initialState, action = {}) =>{
	switch(action.type){
		case 'LOGIN':
			return {
				...state,
				isLoggedIn: true,
				user: action.user
			}
			break;
		case 'IS_LOGIN':
			if(action.user){
				return {
					...state,
					isLoggedIn: true,
					user: action.user
				}
			} else {
				return state
			}
			break;
		case 'LOGOUT':
			return {
				...state,
				isLoggedIn: false,
				user: {}
			}
			break;
		default:
			return state
	}
}
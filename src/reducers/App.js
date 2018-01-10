const initialState = {
	userInfo: null,
	donors: null
}
export default (state = initialState, action = {}) =>{
	switch(action.type){
		case 'FILTER_DONORS_FULFILLED':
			return {
				...state,
				donors: action.payload.data.blood
			}
			break;
		case 'GET_USER_BY_EMAIL_FULFILLED':
			return {
				...state,
				userInfo: action.payload.data.blood[0]
			}
			break;
		default:
			return state
	}
}
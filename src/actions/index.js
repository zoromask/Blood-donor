import fire from '../utility/firebase';
import firebase from 'firebase';
import axios from 'axios';
export const login = (params) => {
	return{
		type: 'LOGIN',
		data: params
	}
}

export const isLogin = () =>{
	return dispatch =>{
		firebase.auth().onAuthStateChanged(function (user) {
			dispatch({
				type: 'IS_LOGIN',
				user: user
			})
		});
		
		
	}
}
export const logout = () => {
	return dispatch => {
		firebase.auth().signOut().then(function(){
			dispatch(
				{
					type: 'LOGOUT'
				}
			)
		}, function(error){
			console.log(error)
		})	
	}
	

	
}
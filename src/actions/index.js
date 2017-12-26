import fire from '../utility/firebase';
import firebase from 'firebase';
import axios from 'axios';
export const login = (params) => {
	let provider
	if(params === 'fb'){
		provider = new firebase.auth.FacebookAuthProvider();
	}else if(params === 'gp'){
		provider = new firebase.auth.GoogleAuthProvider();;
	}
	return dispatch =>{
		firebase.auth().signInWithPopup(provider).then(function(response){
			dispatch({
				type: 'LOGIN',
				user: response.user
			});
		}, function(error){
			console.log(error)
		});	
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

export const addInfo = (params) => {
	return {
		type: 'ADD_INFORMATION',
		payload: axios.post('http://localhost:5000/blood/add', params)
	}
}
import axios from 'axios';
import * as configs from '../utility/configs';
import fire from '../utility/firebase';
import firebase from 'firebase';
import querystring from 'query-string';

export const login = (params) => {
    let provider
    if(params === 'fb'){
        provider = new firebase.auth.FacebookAuthProvider();
    } else if(params === 'gp'){
        provider = new firebase.auth.GoogleAuthProvider();;
	}
	
    return dispatch => {
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
	return dispatch => {
		firebase.auth().onAuthStateChanged(function (user) {
			dispatch({
				type: 'IS_LOGIN',
				user: user
			})
		})
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

export const addInfo = (id, params) => {
	return dispatch => {
		return dispatch({
			type: 'ADD_INFORMATION',
			payload: axios.post(configs.API_URI + '/blood/add', querystring.stringify(params))
		})
	}
}

export const updateInfo = (id, params) => {
	return dispatch => {
		return dispatch({
			type: 'UPDATE_INFORMATION',
			payload: axios.put(configs.API_URI + '/blood/update/' + id, querystring.stringify(params))
		})
	}
}

export const filter = (params) => {
	return dispatch => {
		return dispatch({
			type: 'FILTER_DONORS',
			payload: axios.get(configs.API_URI + '/filter/blood', params)
		})
	}
}

export const getUserByEmail = (email) => {
	return dispatch => {
		return dispatch({
			type: 'GET_USER_BY_EMAIL',
			payload: axios.get(configs.API_URI + '/filter/getbyemail?email=' + email)
		})
	}
}

export const ggGetCoord = (address) => {
	return dispatch => {
		return dispatch({
			type: 'GOOGLE_GET_COORD',
			payload: axios.get(configs.API_GOOGLE_URI + '/maps/api/geocode/json?address=' + address)
		})
	}
}
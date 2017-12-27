import axios from 'axios';

export const login = (params) => {
	return{
		type: 'LOGIN',
		data: params
	}
}

export const addInfo = (params) => {
	return {
		type: 'ADD_INFORMATION',
		payload: axios.post('https://blood-donor-api.herokuapp.com/blood/add', params)
	}
}
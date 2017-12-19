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
		payload: axios.post('http://localhost:5000/blood/add', params)
	}
}
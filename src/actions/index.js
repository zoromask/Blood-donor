import axios from 'axios';
import * as configs from '../utility/configs';

export const login = (params) => {
	return{
		type: 'LOGIN',
		data: params
	}
}

export const addInfo = (params) => {
	return {
		type: 'ADD_INFORMATION',
		payload: axios.post(configs.API_URI + '/blood/add', params)
	}
}
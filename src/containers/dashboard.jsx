import React, { Component } from 'react';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import axios from 'axios';

import { getUser, getIsLoggedIn} from '../selectors';
import {login} from '../actions';
import { connect } from 'react-redux';
import LeftPanel from '../components/LeftPanel.jsx';
export class Dashboard extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			coords: {
				lat: 51.5258541,
				lng: -0.08040660000006028
			},
			mapKey: {
				v: '3.exp',
				key: 'AIzaSyC7-Y8Wp2q_4gYxOxgDFt5XSWbL_NNXjUI'
			},
			login: null,
			radius: 0,
		}
		this.filterAddress = this.filterAddress.bind(this);
		this.filterRadius = this.filterRadius.bind(this);
	}

	onMapCreated(map) {
		map.setOptions({
			disableDefaultUI: true
		});
	}

	onDragEnd(e) {
		console.log('onDragEnd', e);
	}

	onCloseClick() {
		console.log('onCloseClick');
	}

	onClick(e) {
		console.log('onClick', e);
	}

	/** HANDLE FILTER AUTOMATICALLY **/
	filterAddress(address) {
		var { coords } = this.state;
		if (address != '') {
			axios.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + address)
				.then((res) => {
					var { results } = res.data;
					if (results[0]) {
						this.setState({
							coords: {
								...coords,
								lat: results[0].geometry.location.lat,
								lng: results[0].geometry.location.lng
							}
						});
					}
				}).catch((err) => {
					console.log(err);
				});
		}
	}
	filterRadius(radius) {	//Unit: meter
		var { lat, lng } = this.state.coords;
		radius = parseInt(radius) * 100;
		this.setState({ radius: radius });
		// var {lat,lng} = this.state.coords;
		// radius = parseInt(radius) * 100;
		// this.setState({radius: radius});
		// let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius='+radius+'&key=' + this.state.mapKey.key;
		// axios.request({
		// 	url: url,
		// 	method: 'get',
		// 	// `headers` are custom headers to be sent
		// 	headers: {'X-Requested-With': 'XMLHttpRequest'},
		// }).then((res) => {}).catch((err) => {
		// 	console.log(err);
		// });
	}

	render() {
		return (
			<div className="dashboard-container">
				
				<div className="left-panel">
					<LeftPanel {...this.props} 
						filterRadius={this.filterRadius} 
						filterAddress={this.filterAddress}/>
				</div>
				<div className="right-panel">
					<Gmaps
						className="gmap-container"
						width={'100%'}
						height={'100%'}
						lat={this.state.coords.lat}
						lng={this.state.coords.lng}
						zoom={12}
						loadingMessage={'Be happy'}
						params={this.state.mapKey}
						onMapCreated={this.onMapCreated}>

						<Marker
							lat={this.state.coords.lat}
							lng={this.state.coords.lng}
							draggable={true}
							onDragEnd={this.onDragEnd}
							onClick={this.onClick} />

						<Circle
							lat={this.state.coords.lat}
							lng={this.state.coords.lng}
							radius={this.state.radius}
							onClick={this.onClick} />
					</Gmaps>
				</div>
			</div>
		)
	}
};

const mapStateToProps = state => ({
	user: getUser(state),
	isLoggedIn: getIsLoggedIn(state)
})
const mapDispatchToProps = (dispatch) =>{
	return {
		login: (params) => {
			dispatch(login(params))
		}
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
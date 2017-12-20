import React, { Component } from 'react';
import Tabs from '../components/Tabs.jsx';
import Tab from '../components/Tab.jsx';
import FilterTab from '../components/FilterTab.jsx';
import InformationTab from '../components/InformationTab.jsx';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import InfoTab from '../components/SignupTab.jsx';
import axios from 'axios';
import fire from '../utility/firebase';
import firebase from 'firebase';
import querystring from 'query-string';

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
				key: 'YOUR_API_KEY'
			},
			login: null,
			radius: 0,
			content: '',
			showInfoWindow: false,
		}
		this.filterAddress = this.filterAddress.bind(this);
		this.filterRadius = this.filterRadius.bind(this);
		this.onClickMarker = this.onClickMarker.bind(this);
		this.onCloseClickInfoWindow = this.onCloseClickInfoWindow.bind(this);
	}

	componentWillMount() {
		var me = this;
		setTimeout(() => {
			firebase.auth().onAuthStateChanged(function (user) {
				if (user) {
					me.setState({
						login: true,
						currentUser: {
							displayName: user.displayName,
						},
					});
				} else {
					me.setState({
						login: false,
						currentUser: null
					});
				};
			});
		}, 1000);
	}

	onMapCreated(map) {
		map.setOptions({
			disableDefaultUI: true
		});
	}

	onDragEnd(e) {
		console.log('onDragEnd', e);
	}

	onCloseClickInfoWindow() {
		console.log('ok');
		this.setState({
			showInfoWindow: false
		})
	}

	onClickMarker(e) {
		var content = '';
		content += '<label>Fullname: </label> Dung Ngo</br>';
		content += '<label>Address: </label> Hanoi</br>';
		content += '<label>Age: </label> 22</br>';
		content += '<label>Blood type: </label> A</br>';
		content += '<label>Height: </label> 170cm</br>';
		content += '<label>Weight: </label> 65kg</br>';
		this.setState({
			showInfoWindow: true,
			content: content
		});
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
		// axios.request({
		// 	url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+lat+','+lng+'&radius='+radius,
		// 	method: 'get',
		// 	// `headers` are custom headers to be sent
		// 	headers: {'X-Requested-With': 'XMLHttpRequest'},
		// }).then((res) => {}).catch((err) => {
		// 	console.log(err);
		// });
	}

	async addDonorInformation(data) {
		var params = null;
		if(data.address != '') {
			await axios.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + data.address)
				.then((res) => {
					var { results } = res.data;
					if (results[0]) {
						params = {
							...data,
							latitude: results[0].geometry.location.lat,
							longitude: results[0].geometry.location.lng 
						}
					}
				}).catch((err) => {
					console.log(err);
				});
		}

		if(params) {
			await axios.post('http://localhost:5000/blood/add', querystring.stringify(params), {
				headers: {
					'crossDomain': true,
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).then((res) => {
				if(res.data.errmsg) {
					var error = res.data.errmsg;
					console.log(error);
				}
			}).catch((err) => {
				error = err;
			});
		}
	}

	logout() {
		firebase.auth().signOut();
	}

	statusTab(props) {
		const isLoggedIn = props;
		if (isLoggedIn === null) {
			return (
				<div className="load-wrapp">
					<div className="load-5">
						<div className="ring-2">
							<div className="ball-holder">
								<div className="ball"></div>
							</div>
						</div>
					</div>
				</div>
			);
		}
		else if (isLoggedIn) {
			return (
				<Tabs defaultActiveTabIndex={0}>
					<Tab tabName={'Filter'} linkClassName={'link-class-0'}>
						<FilterTab
							filterAddress={this.filterAddress}
							filterRadius={this.filterRadius}
						/>
					</Tab>
					<Tab tabName={'Information'} linkClassName={'link-class-1'}>
						<InformationTab
							currentUser={this.state.currentUser}
							addDonorInformation={this.addDonorInformation}
						/>
					</Tab>
				</Tabs>);
		}
		else {
			return <InfoTab />;
		}
	}

	logoutButton(loggedIn) {
		if (loggedIn)
			return (<span className="btn-logout" onClick={this.logout}> Logout </span>);
	}

	render() {
		return (
			<div className="dashboard-container">
				<div className="topbar">
					<span>Blood Donor Finder</span>
					{this.logoutButton(this.state.login)}
				</div>
				<div className="left-panel">

					{this.statusTab(this.state.login)}
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
						params={this.state.params}
						onMapCreated={this.onMapCreated}>

						<Marker
							lat={this.state.coords.lat}
							lng={this.state.coords.lng}
							draggable={false}
							onDragEnd={this.onDragEnd}
							onClick={this.onClickMarker} />
						{this.state.showInfoWindow ?
							<InfoWindow
								lat={this.state.coords.lat}
								lng={this.state.coords.lng}
								content={this.state.content}
								options={{pixelOffset: new google.maps.Size(0,-37)}}
								onCloseClick={this.onCloseClickInfoWindow}
							/> : '' }

						<Circle
							lat={this.state.coords.lat}
							lng={this.state.coords.lng}
							radius={this.state.radius}/>
					</Gmaps>
				</div>
			</div>
		)
	}
};



export default Dashboard;
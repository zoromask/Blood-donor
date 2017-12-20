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
			currentUser: {
				displayName: '',
				email: '',
				info: null	
			},
			showInfoWindow: false,
		}
		this.filterAddress = this.filterAddress.bind(this);
		this.filterRadius = this.filterRadius.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.addDonorInformation =  this.addDonorInformation.bind(this);
	}

	componentWillMount() {
		var {currentUser} = this.state;
		setTimeout(() => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					this.setState({
						login: true,
						currentUser: {
							...currentUser,
							displayName: user.displayName,
							email: user.email
						}
					});
					this.getUserInfo(user.email);
				} else {
					this.setState({
						login: false
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
	/** END **/

	/** HANDLERS for INFORMATION TAB **/
	getUserInfo(email) {
		var {currentUser} = this.state;
		axios.get('http://localhost:5000/filter/getbyemail?email=' + email)
			.then((res) => {
				var blood = res.data.blood
				if(blood.length) {
					//Render existing info
					this.setState({
						currentUser: {
							...currentUser,
							info: {
								fullName: blood[0].fullName,
								address: blood[0].address,
								age: blood[0].age,
								bloodType: blood[0].bloodType,
								height: blood[0].height,
								weight: blood[0].weight
							}
						}
					});
				} else {
					//please add info
				}

				//
			}).catch((err) => {
				console.log(err);
			})
	}
	async addDonorInformation(data) {
		var params = null;
		var {currentUser} = this.state;
		if(data.address != '') {
			await axios.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + data.address)
				.then((res) => {
					var { results } = res.data;
					if (results[0]) {
						params = {
							...data,
							email: currentUser.email,
							latitude: results[0].geometry.location.lat,
							longitude: results[0].geometry.location.lng 
						}
					}
					this.getUserInfo(currentUser.email);
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
	/** END **/

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
		var {currentUser, coords, showInfoWindow} = this.state;
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
						lat={coords.lat}
						lng={coords.lng}
						zoom={12}
						loadingMessage={'Be happy'}
						params={this.state.params}
						onMapCreated={this.onMapCreated}>

						<Marker
							lat={coords.lat}
							lng={coords.lng}
							draggable={false}
							onDragEnd={this.onDragEnd}
							onClick={() => this.setState({showInfoWindow: true})} />
						{showInfoWindow ?
							<InfoWindow
								lat={coords.lat}
								lng={coords.lng}
								content={
									(currentUser.info ?
										'<label>Fullname: </label>' + currentUser.info.fullName + '</br>' +
										'<label>Address: </label>' + currentUser.info.address + '</br>' +
										'<label>Age: </label>' + currentUser.info.age + '</br>' +
										'<label>Blood type: </label>' + currentUser.info.bloodType + '</br>' +
										'<label>Height: </label>' + currentUser.info.height + '</br>' +
										'<label>Weight: </label>' + currentUser.info.weight + '</br>' : ''
									)
								}
								options={{pixelOffset: new google.maps.Size(0,-37)}}
								onCloseClick={() => this.setState({showInfoWindow: false})}
							/> : '' }

						<Circle
							lat={coords.lat}
							lng={coords.lng}
							radius={this.state.radius}/>
					</Gmaps>
				</div>
			</div>
		)
	}
};



export default Dashboard;
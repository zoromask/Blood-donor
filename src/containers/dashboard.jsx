import React, { Component } from 'react';
import Tabs from '../components/Tabs.jsx';
import Tab from '../components/Tab.jsx';
import FilterTab from '../components/FilterTab.jsx';
import InformationTab from '../components/InformationTab.jsx';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import '../utility/markerclusterer';
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
			donors: [ //array of donors
				{
					lat: 21.029011,
					lng: 105.836020
				},
				{
					lat: 21.029852,
					lng: 105.832908
				},
				{
					lat: 21.028410,
					lng: 105.826106
				},
				{
					lat: 21.032147,
					lng: 105.833011
				},
				{
					lat: 21.025646,
					lng: 105.835354
				}
			],
			mapKey: {
				v: '3.exp',
				key: 'AIzaSyC7-Y8Wp2q_4gYxOxgDFt5XSWbL_NNXjUI'
			},
			login: null,
			radius: 500,
			currentUser: {
				displayName: '',
				email: '',
				info: null	
			},
			currentInfoWindow: null,
			showInfoWindow: false,
		}
		this.onMapCreated = this.onMapCreated.bind(this);
		this.filterAddress = this.filterAddress.bind(this);
		this.filterRadius = this.filterRadius.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.editDonorInformation =  this.editDonorInformation.bind(this);
		this.auth = this.auth.bind(this);
		this.openInfoWindow = this.openInfoWindow.bind(this);
	}

	componentDidMount() {
		this.auth();
	}

	/** AUTHENTICATION **/
	auth() {
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
	/** END **/

	/** MAP HANDLER **/
	onMapCreated(map) {
		map.setOptions({
			disableDefaultUI: true
		});
		// create new markerClusterer
		var {donors} = this.state;
		var markers = donors.map((donor) => {
			return new google.maps.Marker({
				map: map,
				position: {lat: donor.lat, lng: donor.lng},
				donor: donor	//insert donor information to marker ~ wow
			})
		});
		new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

		//Add marker click event
		markers.map(marker => {
			marker.addListener('click', () => {
				this.openInfoWindow(marker.donor);
			})
		})
	}
	onDragEnd(e) {
		console.log('onDragEnd', e);
	}
	openInfoWindow(donor) {
		this.setState({
			currentInfoWindow: donor,
			showInfoWindow: true
		});
	}
	/** END **/

	/** HANDLE FILTER AUTOMATICALLY **/
	filterAddress(address) {
		var { coords } = this.state;
		if (address != '') {
			axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
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
	/** END **/

	/** HANDLERS for INFORMATION TAB **/
	getUserInfo(email) {
		var {currentUser} = this.state;
		axios.get('https://blood-donor-api.herokuapp.com/filter/getbyemail?email=' + email)
			.then((res) => {
				var blood = res.data.blood
				if(blood.length) {
					//Render existing info
					this.setState({
						coords: {
							lat: blood[0].latitude,
							lng: blood[0].longitude
						},
						currentUser: {
							...currentUser,
							info: {
								_id: blood[0]._id,
								fullName: blood[0].fullName,
								address: blood[0].address,
								age: blood[0].age,
								phone: blood[0].phone,
								bloodType: blood[0].bloodType,
								height: blood[0].height,
								weight: blood[0].weight,
								lat: blood[0].latitude,
								lng: blood[0].longitude
							}
						}
					})
				} else {
					//please add info
				}
			}).catch((err) => {
				console.log(err);
			})
	}
	async editDonorInformation(data) {
		var params = null;
		var error = 0;
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
				}).catch((err) => {
					error = 1;
					console.log(err);
				});
		} else {
			error = 1;
		}

		if(params) {
			var url = (!currentUser.info) ? 'https://blood-donor-api.herokuapp.com/blood/add' : 'https://blood-donor-api.herokuapp.com/blood/update/' + currentUser.info._id;
			var action = (!currentUser.info) ? axios.post : axios.put;
			await action(url, querystring.stringify(params)).then((res) => {
				if(res.data.errmsg) {
					error = res.data.errmsg;
				}
				this.getUserInfo(currentUser.email);
				this.setState({
					showInfoWindow: true
				});
			}).catch((err) => {
				error = 1;
				console.log(err);
			});
		} else {
			error = 1;
		}

		return error;
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
							editDonorInformation={this.editDonorInformation}
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
		var {coords, donors, currentInfoWindow, showInfoWindow} = this.state;
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
						params={this.state.mapKey}
						onMapCreated={this.onMapCreated}
						onZoomChanged={() => this.setState({showInfoWindow: false})}>
						
						<Marker
							lat={coords.lat}
							lng={coords.lng}
							draggable={false}
							onDragEnd={this.onDragEnd}
							onClick={() => this.openInfoWindow(this.state.currentUser.info)}/>

						{showInfoWindow && currentInfoWindow ?
							<InfoWindow
								lat={currentInfoWindow.lat}
								lng={currentInfoWindow.lng}
								content={
									(currentInfoWindow ?
										'<label>Fullname: </label>' + currentInfoWindow.fullName + '</br>' +
										'<label>Address: </label>' + currentInfoWindow.address + '</br>' +
										'<label>Age: </label>' + currentInfoWindow.age + '</br>' +
										'<label>Phone: </label>' + currentInfoWindow.phone + '</br>' +
										'<label>Blood type: </label>' + currentInfoWindow.bloodType + '</br>' +
										'<label>Height: </label>' + currentInfoWindow.height + '</br>' +
										'<label>Weight: </label>' + currentInfoWindow.weight + '</br>' : ''
									)
								}
								options={{pixelOffset: new google.maps.Size(0,-37)}}
								onCloseClick={() => this.setState({showInfoWindow: false})}
							/> : '' }
					</Gmaps>
				</div>
			</div>
		)
	}
};



export default Dashboard;
import React, { Component } from 'react';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import { getUser, getIsLoggedIn} from '../selectors';
import {login} from '../actions';
import { connect } from 'react-redux';
import LeftPanel from '../components/LeftPanel.jsx';
import '../utility/markerclusterer';
import InfoTab from '../components/SignupTab.jsx';
import axios from 'axios';
import fire from '../utility/firebase';
import firebase from 'firebase';
import querystring from 'query-string';
import * as configs from '../utility/configs';


import * as images from '../images/image';

import * as Helpers from '../utility/helper';

export class Dashboard extends Component {
	constructor(props, context) {
		super(props, context);
		this.baseState = {
			coords: {
				lat: '21.0245',
				lng: '105.84117'
			},
			donors: [],
			markers: null,
			markersCluster: null,
			currentUser: {
				displayName: '',
				email: '',
				info: null	
			},
			currentInfoWindow: null,
			showInfoWindow: false,
			mapKey: {
				v: '3.exp',
				key: 'AIzaSyC7-Y8Wp2q_4gYxOxgDFt5XSWbL_NNXjUI'
			},
			login: null,
			filterData: null,
		}
		this.state = this.baseState;
		this.onMapCreated = this.onMapCreated.bind(this);
		this.filterAddress = this.filterAddress.bind(this);
		this.filter = this.filter.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.editDonorInformation =  this.editDonorInformation.bind(this);
		this.auth = this.auth.bind(this);
		this.openInfoWindow = this.openInfoWindow.bind(this);
		this.createMarkers = this.createMarkers.bind(this);
		this.deleteMarkers = this.deleteMarkers.bind(this);
	}

	componentDidMount() {
		this.auth();
	}

	/** AUTHENTICATION **/
	auth() {
		setTimeout(() => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					this.setState({
						login: true,
						currentUser: {
							...this.state.currentUser,
							displayName: user.displayName,
							email: user.email
						}
					});
					this.getUserInfo(user.email);
				} else {
					this.setState({
						...this.baseState,
						login: false
					});
				};
			});
		}, 1000);
	}
	/** END **/

	/** MAP HANDLER **/
	onMapCreated(map) {
		map.setOptions({ disableDefaultUI: true });
		this.setState({ map: map });
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
	createMarkers() {
		// remove old markers
		this.deleteMarkers();

		// create new markers
		var {donors, map} = this.state;
		if(donors.length) {
			var markers = donors.map((donor) => {
				return new google.maps.Marker({
					map: map,
					icon: {
						url: images.blood,
						anchor: new google.maps.Point(100, 120)
					},
					position: {lat: donor.latitude, lng: donor.longitude},
					donor: donor	//insert donor information to marker ~ wow
				})
			});
			var imageStyle = {
				textColor: 'white',
				textSize: 14,
				width: 50,
				height: 50,
				backgroundPosition: 'center center'
			}
			this.setState({
				markers: markers,
				markersCluster: new MarkerClusterer(map, markers, {
					styles: [
						{
							...imageStyle,
							url: images.m1
						}, {
							...imageStyle,
							url: images.m2
						}, {
							...imageStyle,
							url: images.m3
						}, {
							...imageStyle,
							url: images.m4
						}, {
							...imageStyle,
							url: images.m5
						}
					]
				})
			});
			//Add marker click event
			this.state.markers.map(marker => {
				marker.addListener('click', () => {
					this.openInfoWindow(marker.donor);
				});
			});
		}
	}
	deleteMarkers() {
		this.setState({showInfoWindow: false});
		var {markers, markersCluster} = this.state;
		if(markers) {
			markers.map(marker => { marker.setMap(null); });
			markersCluster.clearMarkers();
		}
	}
	/** END **/

	/** HANDLE FILTER AUTOMATICALLY **/
	async filterAddress(data, location) {
		this.setState({
			coords: {
				...this.state.coords,
				lat: location.lat(),
				lng: location.lng()
			}
		}, () => {
			this.filter(data);
		});
	}
	filter(data) {	//Unit: meter
		var { caculateDestionationPoint } = Helpers;
		var currentCoords = this.state.coords; 
		axios.get(configs.API_URI + '/filter/blood', {
			params: {
				bloodType: data.bloodType,
				ageFrom: data.minAge,
				ageTo: data.maxAge,
				longitudeMin: caculateDestionationPoint(currentCoords, -90, data.radius).lng,
				longitudeMax: caculateDestionationPoint(currentCoords, 90, data.radius).lng,
				latitudeMin: caculateDestionationPoint(currentCoords, -180, data.radius).lat,
				latitudeMax: caculateDestionationPoint(currentCoords, 0, data.radius).lat,
			}
		}).then((res) => {
			if(res.data.blood.length) {
				this.setState({
					donors: res.data.blood,
					filterData: data
				})
			} else {
				this.setState({
					donors: [],
					filterData: data
				})
			}
			this.createMarkers();
		}).catch((err) => {
			console.log(err);
		});
	}
	/** END **/

	/** HANDLERS for INFORMATION TAB **/
	async getUserInfo(email) {
		await axios.get(configs.API_URI + '/filter/getbyemail?email=' + email)
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
							...this.state.currentUser,
							info: {
								_id: blood[0]._id,
								fullName: blood[0].fullName,
								address: blood[0].address,
								age: blood[0].age,
								phone: blood[0].phone,
								bloodType: blood[0].bloodType,
								height: blood[0].height,
								weight: blood[0].weight,
								latitude: blood[0].latitude,
								longitude: blood[0].longitude
							}
						}
					}, () => {
						this.setState({ currentInfoWindow: this.state.currentUser.info });
						if(this.state.filterData) { this.filter(this.state.filterData); }
					});
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
		if(data.location) {
			params = {
				...data,
				email: currentUser.email,
				latitude: data.location.lat(),
				longitude: data.location.lng()
			}
			delete params['location'];
		} else {
			if(data.address != '') {
				await axios.get(configs.API_GOOGLE_URI + '/maps/api/geocode/json?address=' + data.address)
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
		}

		if(params) {
			var url = (!currentUser.info) ? configs.API_URI + '/blood/add' : configs.API_URI + '/blood/update/' + currentUser.info._id;
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

	logoutButton(loggedIn) {
		if (loggedIn)
			return (<span className="btn-logout" onClick={this.logout}> Logout </span>);
	}

	render() {
		var {coords, donors, currentUser, currentInfoWindow, showInfoWindow, radius} = this.state;
		return (
			<div className="dashboard-container">
				
				<div className="left-panel">
					<LeftPanel {...this.props}
						map = {this.state.map}
						searchArea = {this.state.searchArea}
						filterAddress={this.filterAddress}
						filter={this.filter}
						currentUser={this.state.currentUser}
						editDonorInformation={this.editDonorInformation}
					/>
				</div>
				<div className="right-panel">
					{coords ?
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
							
							<Marker	//user
								lat={(currentUser.info) ? currentUser.info.latitude : coords.lat}
								lng={(currentUser.info) ? currentUser.info.longitude : coords.lng}
								icon={{
									url: images.marker,
									anchor: new google.maps.Point(100, 120)
								}}
								draggable={false}
								onDragEnd={this.onDragEnd}
								onClick={() => this.openInfoWindow(this.state.currentUser.info)}/>

							{showInfoWindow && currentInfoWindow ?
								<InfoWindow
									lat={currentInfoWindow.latitude}
									lng={currentInfoWindow.longitude}
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
						</Gmaps> : 'Loading..'
					}
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
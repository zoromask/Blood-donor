import React, { Component } from 'react';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import { connect } from 'react-redux';

import LeftPanel from './LeftPanel.jsx';
import '../utility/markerclusterer';
import InfoTab from './SignupTab.jsx';

import * as configs from '../utility/configs';
import * as images from '../images/image';
import * as Helpers from '../utility/helper';

class Dashboard extends Component {
	constructor(props, context) {
		super(props, context);
		this.baseState = {
			coords: {
				lat: '21.0245',
				lng: '105.84117'
			},
			markers: null,
			markersCluster: null,
			currentInfoWindow: null,
			showInfoWindow: false,
			mapKey: {
				v: '3.exp',
				key: 'AIzaSyC7-Y8Wp2q_4gYxOxgDFt5XSWbL_NNXjUI'
			},
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
			const {user, isLoggedIn} = this.props;
			if(isLoggedIn && user) {
				this.getUserInfo(user.email);
			} else {
				this.setState({
					...this.baseState
				});
			}
		}, 1000);
	}
	/** END **/

	/** MAP HANDLER **/
	onMapCreated(map) {
		map.setOptions({ disableDefaultUI: true });
		this.setState({ map: map });
	}
	openInfoWindow(donor) {
		this.setState({
			...this.state,
			currentInfoWindow: donor,
			showInfoWindow: true
		});
	}
	createMarkers() {
		// remove old markers
		this.deleteMarkers();
		// create new markers
        var {map} = this.state;
		var {donors} = this.props;
		if(donors && donors.length) {
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
        const { actions } = this.props; 
        actions.filter({	//FILTER_BLOOD
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
            this.setState({ filterData: data })
			this.createMarkers();
		}).catch((err) => {
			console.log(err);
		});
	}
	/** END **/

	/** HANDLERS for INFORMATION TAB **/
	async getUserInfo(email) {
		const { actions } = this.props;
		await actions.getUserByEmail(email);
		const { userInfo } = this.props;
		if(userInfo) {
			//Render existing info
			this.setState({
				coords: {
					lat: userInfo.latitude,
					lng: userInfo.longitude
				}
			}, () => {
				this.setState({ currentInfoWindow: userInfo });
				if(this.state.filterData) { this.filter(this.state.filterData); }
			});
		}
	}

	async editDonorInformation(data) {
		const { actions, userInfo } = this.props;
		var params = null;
		var error = 0;
		var {user} = this.props;
		if(data.location) {
			params = {
				...data,
				email: user.email,
				latitude: data.location.lat(),
				longitude: data.location.lng()
			}
			delete params['location'];
		} else {
			if(data.address != '') {	//GOOGLE_GET_COORD
				await actions.ggGetCoord(data.address).then((res) => {
						var { results } = res.value.data;
						if (results[0]) {
							params = {
								...data,
								email: user.email,
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

		if(params) {	//UPDATE_INFORMATION //ADD_INFORMATION
			var action = (!userInfo) ? actions.addInfo : actions.updateInfo;
			await action(userInfo._id, params).then((res) => {
				if(res.value.data.error_message) {
					error = res.value.data.error_message;
				}
				this.getUserInfo(user.email);
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

	render() {
		var {coords, currentInfoWindow, showInfoWindow, radius} = this.state;
		var { userInfo, user } = this.props;
        return (
			<div className="dashboard-container">
				<div className="left-panel">
					<LeftPanel {...this.props}
						map = {this.state.map}
						searchArea = {this.state.searchArea}
						filterAddress={this.filterAddress}
						filter={this.filter}
						currentUser={user}
						userInfo={userInfo}
						editDonorInformation={this.editDonorInformation}/>
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
								lat={(userInfo) ? userInfo.latitude : coords.lat}
								lng={(userInfo) ? userInfo.longitude : coords.lng}
								icon={{
									url: images.marker,
									anchor: new google.maps.Point(100, 120)
								}}
								draggable={false}
								onClick={() => this.openInfoWindow(this.props.userInfo)}/>

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

export default Dashboard;
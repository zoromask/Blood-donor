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

export class Dashboard extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			coords: {
				lat: 22.0667799,
				lng: 105.8027846,
			},
			mapKey: {
				v: '3.exp',
				key: 'YOUR_API_KEY'
			},
			login: null,
			radius: 0,
			listUser: [{
				name: "Nhat",
				lat: 21.0667799,
				long: 105.8027846,
			}, {
				name: "Dung",
				lat: 21.02939180913695,
				long: 105.77293395996094,
			}, {
				name: "Thai",
				lat: 21.01272715296389,
				long: 105.84159851074219,
			}, {
				name: "Long",
				lat: 20.970416204423838,
				long: 105.81962585449219,
			}
			],
		}
		this.filterAddress = this.filterAddress.bind(this);
		this.filterRadius = this.filterRadius.bind(this);
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

	// getUserPointer() {
	// 	var me = this;
	// 	const data = this.state.listUser;
	// 	let results = [];
	// 	data.forEach((eachData) => {
	// 		let temp = (<Marker
	// 			lat={eachData.lat}
	// 			lng={eachData.long}
	// 			draggable={true}
	// 			onClick={me.onClick}
	// 			key = {eachData.name}
	// 		/>);
	// 		results.push(temp);
	// 	});
	// 	return results;
	// }

	getUserPointer() {
		var me = this;
		const data = this.state.listUser;
		const results = data.map((eachData) => 
			<Marker
				lat={eachData.lat}
				lng={eachData.long}
				draggable={true}
				onClick={me.onClick}
				key = {eachData.name}
			/>
		);
		return results;
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
		// axios.request({
		// 	url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+lat+','+lng+'&radius='+radius,
		// 	method: 'get',
		// 	// `headers` are custom headers to be sent
		// 	headers: {'X-Requested-With': 'XMLHttpRequest'},
		// }).then((res) => {}).catch((err) => {
		// 	console.log(err);
		// });
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
						<InformationTab currentUser={this.state.currentUser} />
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
							draggable={true}
							onDragEnd={this.onDragEnd}
							onClick={this.onClick} />

						{this.getUserPointer()}

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



export default Dashboard;
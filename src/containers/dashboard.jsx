import React, { Component } from 'react';
import Tabs from '../components/Tabs.jsx';
import Tab from '../components/Tab.jsx';
import FilterTab from '../components/FilterTab.jsx';
import InfoTab from '../components/SignupTab.jsx';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import fire from '../utility/firebase';
import firebase from 'firebase';

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
			login: false
		}
	}

	componentWillMount() {
		var me = this;
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				me.setState({
					login: true
				});
				console.log('login');
			} else {
				me.setState({
					login: false
				});
				console.log("signout");
			};
		});
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

	logout() {
		firebase.auth().signOut();
	}

	statusTab(props) {
		const isLoggedIn = props;
		if (isLoggedIn) {
			return (
				<Tabs defaultActiveTabIndex={0}>
					<Tab tabName={'Filter'} linkClassName={'link-class-0'}>
						<FilterTab />
					</Tab>
					<Tab tabName={'Information'} linkClassName={'link-class-1'}>
						<p> Content 1</p>
					</Tab>
				</Tabs>);
		}
		else {
			return <InfoTab />;
		}
	}


	render() {
		return (
			<div className="dashboard-container">
				<div className="topbar">
					<span>Blood Donor Finder</span>
					<span className="btn-logout" onClick={this.logout}> Logout </span>
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
					</Gmaps>
				</div>
			</div>
		)
	}
};



export default Dashboard;
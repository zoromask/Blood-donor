import React, {Component} from 'react';
import Tabs from '../components/Tabs.jsx';
import Tab from '../components/Tab.jsx';
import FilterTab from '../components/FilterTab.jsx';
import InformationTab from '../components/InformationTab.jsx';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import axios from 'axios';

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
			}
		}
		this.filterAddress = this.filterAddress.bind(this);
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

	filterAddress(address) {
		var {coords} = this.state;
		axios.get('http://maps.googleapis.com/maps/api/geocode/json?address='+address)
			.then((res) => {
				var { results } = res.data;
				if(results[0]) {
					this.setState({coords: {
						...coords,
						lat: results[0].geometry.location.lat, 
						lng: results[0].geometry.location.lng}
					});
				}
			}).catch((err) => {
				console.log(err);
			});
	}

	render() {
		return (
			<div className="dashboard-container">
				<div className="topbar">
					<span>Blood Donor Finder</span>
				</div>
				<div className="left-panel">
					<Tabs defaultActiveTabIndex={0}>
						<Tab tabName={'Filter'} linkClassName={'link-class-0'}>
							<FilterTab
								filterAddress={this.filterAddress}
							/>
						</Tab>
						<Tab tabName={'Information'} linkClassName={'link-class-1'}>
							<InformationTab />
						</Tab>
					</Tabs>
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
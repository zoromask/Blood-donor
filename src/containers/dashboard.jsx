import React, {Component} from 'react';
import Tabs from '../components/Tabs.jsx';
import Tab from '../components/Tab.jsx';
import FilterTab from '../components/FilterTab.jsx';
import InformationTab from '../components/InformationTab.jsx';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';

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

	render() {
		return (
			<div className="dashboard-container">
				<div className="topbar">
					<span>Blood Donor Finder</span>
				</div>
				<div className="left-panel">
					<Tabs defaultActiveTabIndex={0}>
						<Tab tabName={'Filter'} linkClassName={'link-class-0'}>
							<FilterTab />
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
							onDragEnd={this.onDragEnd} />
						<InfoWindow
							lat={this.state.coords.lat}
							lng={this.state.coords.lng}
							content={'Hello, React :)'}
							onCloseClick={this.onCloseClick} />
						<Circle
							lat={this.state.coords.lat}
							lng={this.state.coords.lng}
							radius={500}
							onClick={this.onClick} />
					</Gmaps>
				</div>
			</div>
		)
	}
};

export default Dashboard;
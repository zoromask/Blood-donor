import React, { Component } from 'react';

class InformationTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputs: null
        }
        this.setData = this.setData.bind(this);
        this.addressOnChange = this.addressOnChange.bind(this);
    }
    componentWillMount() {
        this.setData();
    }
    componentDidMount() {
        this.addressOnChange();
    }
    addressOnChange() {
        var $addressInput = document.getElementById('infoAddressInput');
        var autocomplete = new google.maps.places.Autocomplete($addressInput);
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', this.props.map);
        autocomplete.addListener('place_changed', () => {
            var place = autocomplete.getPlace();
            if(place.geometry) {
                this.setState({ 
                    inputs: {
                        ...this.state.inputs,
                        location: place.geometry.location
                }});
            }
            this.setState({ 
                inputs: {
                    ...this.state.inputs,
                    address: place.name 
            }});
        })
    }
    setData() {
        var {displayName, phoneNumber} = this.props.currentUser;
        var {userInfo} = this.props;
        var data = null;
        if(userInfo) {
            data = {
                fullName: userInfo.fullName ? userInfo.fullName : (displayName ? displayName : ''),
                address: userInfo.address ? userInfo.address : '',
                phone: userInfo.phone ? userInfo.phone : (phoneNumber ? phoneNumber : ''),
                age: userInfo.age ? userInfo.age : '',
                bloodType: userInfo.bloodType ? userInfo.bloodType : 'A',
                height: userInfo.height ? userInfo.height : 0,
                weight: userInfo.weight ? userInfo.weight : 0,
            }
        } else {
            data = {
                fullName: displayName ? displayName : '',
                address: '',
                phone: phoneNumber ? phoneNumber : '',
                age: 10,
                bloodType: 'A',
                height: 0,
                weight: 0,
            };
        }
        this.setState({
            inputs: data
        });
    }
    save(e) {
        var {inputs} = this.state;
        this.props.editDonorInformation(inputs).then((error) => {
            if(error) {
                this.props.renderErrorMessage();
            } else {
                this.props.renderSuccessMessage();
            }
        });
    }
    render() {
        var {displayName, phoneNumber} = this.props.currentUser;
        var {inputs} = this.state;
        return (
            <div className="infoTab">
                <div className="infoTab-field">
                    <div className="infoTab-field-item">
                        <label className="field-title"> Fullname </label>
                        <input type="text" className ="text-field" value={inputs.fullName}
                            onChange={(e) => this.setState({inputs: {...inputs, fullName: e.target.value}})}/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Address </label>
                        <input type="text" id="infoAddressInput" className ="text-field" value={inputs.address}
                            onChange={(e) => this.setState({inputs: {...inputs, address: e.target.value}})}/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Phone </label>
                        <input type="text" className ="text-field" value={inputs.phone}
                            onChange={(e) => this.setState({inputs: {...inputs, phone: e.target.value}})}/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Age </label>
                        <input type="number" min="10" max="50" className ="text-field" value={inputs.age}
                            onChange={(e) => this.setState({inputs: {...inputs, age: e.target.value}})}/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Blood type </label>
                        <select id="blood-type" className ="text-field" value={inputs.bloodType}
                            onChange={(e) => this.setState({inputs: {...inputs, bloodType: e.target.value}})}>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                        </select>      
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Height (cm) </label>
                        <input type="number" min="0" className ="text-field" value={inputs.height}
                            onChange={(e) => this.setState({inputs: {...inputs, height: e.target.value}})}/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Weight (kg) </label>
                        <input type="number" min="0" className ="text-field" value={inputs.weight}
                            onChange={(e) => this.setState({inputs: {...inputs, weight: e.target.value}})}/>
                    </div >
                </div>
                <button type="button" className="button" onClick={(e) => this.save(e)}>Save</button>
                <button type="button" className="button" onClick={(e) => this.setData(e)}>Reset</button>
            </div>
        )
    }
}
export default InformationTab
import React, { Component } from 'react';

class InformationTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputs: null
        }
    }
    componentWillMount() {
        var {displayName, phoneNumber, info} = this.props.currentUser;
        this.setState({
            inputs: {
                fullName: info.fullName ? info.fullName : (displayName ? displayName : ''),
                address: info.address ? info.address : '',
                phone: info.phone ? info.phone : (phoneNumber ? phoneNumber : ''),
                age: info.age ? info.age : '',
                bloodType: info.bloodType ? info.bloodType : 'A',
                height: info.height ? info.height : 0,
                weight: info.weight ? info.weight : 0,
            }
        })
    }
    save(e) {
        var {inputs} = this.state;
        var error = this.props.editDonorInformation(inputs);
    }
    reset(e) {
        var {displayName, phoneNumber} = this.props.currentUser;
        var resetInputs = {
            fullName: displayName,
            address: '',
            phone: phoneNumber ? phoneNumber : '0123456789',
            age: 10,
            bloodType: 'A',
            height: 0,
            weight: 0,
        };
        this.setState({ inputs: resetInputs });
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
                        <input type="text" className ="text-field" value={inputs.address}
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
                <button type="button" className="button" onClick={(e) => this.reset(e)}>Reset</button>
            </div>
        )
    }
}

export default InformationTab
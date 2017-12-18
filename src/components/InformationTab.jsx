import React, { Component } from 'react';

class InformationTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputs: {
            }
        }
    }
    render() {
        return (
            <div className="infoTab">
                <div className="infoTab-field">
                    <div className="infoTab-field-item">
                        <label className="field-title"> Full Name </label>
                        <input type="text" className ="text-field" defaultValue={this.props.currentUser.displayName}/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Address </label>
                        <input type="text" className ="text-field"/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Phone </label>
                        <input type="text" className ="text-field" defaultValue={this.props.currentUser.phoneNumber}/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Age </label>
                        <input type="text" className ="text-field"/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Blood type </label>
                        <select id="blood-type" className ="text-field">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                        </select>      
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Height (cm) </label>
                        <input type="text" className ="text-field"/>
                    </div>
                    <div className="infoTab-field-item">
                        <label className="field-title"> Weight (kg) </label>
                        <input type="text" className ="text-field"/>
                    </div >
                </div>
                <button type="button" className="button">Save</button>
                <button type="button" className="button">Reset</button>
            </div>
        )
    }
}

export default InformationTab
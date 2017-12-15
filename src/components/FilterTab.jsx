import React, { Component } from 'react';
import noUiSlider from 'nouislider';

class FilterTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputs: {
                bloodType: 'A',
                address: ''
            }
        }
        this.handleInputs = this.handleInputs.bind(this);
        this.formatRange = this.formatRange.bind(this);
    }

    componentDidMount() {
        var ageSlider = document.getElementById('ageRange');
        noUiSlider.create(ageSlider, {
            start: [10, 50],
            connect: true,
            step: 1,
            range: {
                min: 10,
                max: 50
            },
            format: this.formatRange()
        })
        ageSlider.noUiSlider.on('update', function(values, handle){
            var ageText = document.getElementById('ageText');
            ageText.innerHTML = ageSlider.noUiSlider.get()[0] + '-' + ageSlider.noUiSlider.get()[1];
        });

        var radiusSlider = document.getElementById('radiusRange');        
        noUiSlider.create(radiusSlider, {
            start: [0, 10],
            connect: true,
            step: 1,
            range: {
                min: 0,
                max: 10
            },
            format: this.formatRange()
        })
        radiusSlider.noUiSlider.on('update', function(values, handle){
            var radiusText = document.getElementById('radiusText');
            radiusText.innerHTML = radiusSlider.noUiSlider.get()[0] + '-' + radiusSlider.noUiSlider.get()[1];
        });
    }

    handleInputs(e) {
        var data = {...this.state.inputs, radius: '', age: ''};
        var ageSlider = document.getElementById('ageRange');
        var radiusSlider = document.getElementById('radiusRange');
        data.ages = ageSlider.noUiSlider.get();
        data.radius = radiusSlider.noUiSlider.get();
        this.props.submitData(data);
    }

    formatRange() {
        return {
            from: function(value) {
                return parseInt(value);
            },
            to: function(value) {
                return parseInt(value);
            }
        }
    }

    render() {
        var { inputs } = this.state;
        return (
            <div className="filter-wrapper">
                <div className="">
                    <span>Blood Type </span>
                    <select name="bloodtype" className="blood-type-selectbox"
                        onChange={(e) => this.setState({inputs: {...inputs, bloodType: e.target.value}})} value={inputs.bloodType}>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="0">O</option>
                        <option value="AB">AB</option>
                    </select>
                </div>

                <div className="">
                    <span>Address: </span>
                    <input type="text" name="address" onChange={(e) => this.setState({inputs: {...inputs, address: e.target.value}})} value={inputs.address}/>
                </div>

                <div className="filter-range">
                    <div>Age: <span id="ageText"></span></div>
                    <div id="ageRange"></div>
                </div>

                <div className="filter-range">
                    <div>Radius: <span id="radiusText"></span></div>
                    <div id="radiusRange"></div>
                </div>

                <div className="">
                    <button className="" onClick={(e) => this.handleInputs(e)}>Submit</button>
                </div>
            </div>
        )
    }
}

export default FilterTab
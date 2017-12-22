import React, { Component } from 'react';
import noUiSlider from 'nouislider';

class FilterTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputs: {
                bloodType: 'A',
                address: '',
                minAge: 10,
                maxAge: 50,
                radius: 1
            }
        }
        this.formatRange = this.formatRange.bind(this);
        this.addressOnChange = this.addressOnChange.bind(this);
        this.bloodyTypeOnChange = this.bloodyTypeOnChange.bind(this);
    }

    componentDidMount() {
        this.initializeRangeSlider();
        this.addressOnChange();
    }

    //Bloody Type on change
    bloodyTypeOnChange(e) {
        var { inputs } = this.state;
        this.setState({inputs: {...inputs, bloodType: e.target.value}});
        this.props.filter(inputs);
    }
    //Address on change
    addressOnChange() {
        var { inputs } = this.state;
        var { debounce, filterAddress } = this.props;
        document.getElementById('addressInput').addEventListener('input', debounce((e) => {
            this.setState({inputs: {...inputs, address: e.target.value}});
            this.props.filterAddress(e.target.value);
        }, 300));
    }
    //Create range sliders & Handle ranges on change
    initializeRangeSlider() {
        var { inputs } = this.state;
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
        ageSlider.noUiSlider.on('update', (values, handle) => {
            var ageText = document.getElementById('ageText');
            ageText.innerHTML = ageSlider.noUiSlider.get()[0] + ' - ' + ageSlider.noUiSlider.get()[1];
            this.setState({
                inputs: {
                    ...inputs, 
                    minAge: parseInt(ageSlider.noUiSlider.get()[0]),
                    maxAge: parseInt(ageSlider.noUiSlider.get()[1])
                }
            });
            this.props.filter(this.state.inputs);
        });

        var radiusSlider = document.getElementById('radiusRange');        
        noUiSlider.create(radiusSlider, {
            start: [1],
            connect: [true, false],
            step: 1,
            range: {
                min: 0,
                max: 10
            },
            format: this.formatRange()
        })
        radiusSlider.noUiSlider.on('update', (values, handle) => {
            var radiusText = document.getElementById('radiusText');
            var value = radiusSlider.noUiSlider.get();
            radiusText.innerHTML = value;
            this.setState({inputs: {...inputs, radius: parseInt(value)*100}});
            this.props.filter(this.state.inputs);
        });
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
        var {debounce} = this.props;
        return (
            <div className="filter-wrapper infoTab">
                <div className="infoTab-field-item">
                    <label className="field-title">Blood Type: </label>
                    <select name="bloodtype" className="blood-type-selectbox text-field"
                        onChange={(e) => this.bloodyTypeOnChange(e)}>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="0">O</option>
                    </select>
                </div>

                <div className="infoTab-field-item">
                    <label className="field-title">Address: </label >
                    <input id="addressInput" type="text" name="address" className="text-field" required/>
                </div>

                <div className="infoTab-field-item filter-range">
                    <div><label className="field-title">Age: </label><span id="ageText"></span></div>
                    <div id="ageRange"></div>
                </div><br/>

                <div className="infoTab-field-item filter-range">
                    <div><label className="field-title">Radius: </label><span id="radiusText"></span> (km)</div>
                    <div id="radiusRange"></div>
                </div>
            </div>
        )
    }
}

export default FilterTab
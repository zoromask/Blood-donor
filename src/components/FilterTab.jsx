import React, { Component } from 'react';
import noUiSlider from 'nouislider';
import { debounce } from '../utility/helper';

class FilterTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputs: {
                bloodType: 'A',
                address: '',
                minAge: 10,
                maxAge: 50,
                radius: 5
            }
        }
        this.formatRange = this.formatRange.bind(this);
        this.addressOnChange = this.addressOnChange.bind(this);
        this.bloodyTypeOnChange = this.bloodyTypeOnChange.bind(this);
    }

    componentDidMount() {
        this.addressOnChange();
        this.initializeRangeSlider();
    }

    //Bloody Type on change
    bloodyTypeOnChange(e) {
        this.setState({inputs: {...this.state.inputs, bloodType: e.target.value}}, () => {
            this.props.filter(this.state.inputs);
        });
    }
    //Address on change
    addressOnChange() {
        var $addressInput = document.getElementById('filterAddressInput');
        var { filterAddress } = this.props;

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
                        address: place.name
                    }}, () => {
                        filterAddress(this.state.inputs, place.geometry.location);
                    });
            }
        })
    }
    //Create range sliders & Handle ranges on change
    initializeRangeSlider() {
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
        });

        var ageText = document.getElementById('ageText');
        ageText.innerHTML = ageSlider.noUiSlider.get()[0] + ' - ' + ageSlider.noUiSlider.get()[1];
        ageSlider.noUiSlider.on('change', debounce((values, handle) => {
            ageText.innerHTML = ageSlider.noUiSlider.get()[0] + ' - ' + ageSlider.noUiSlider.get()[1];
            this.setState({
                inputs: {
                    ...this.state.inputs, 
                    minAge: parseInt(ageSlider.noUiSlider.get()[0]),
                    maxAge: parseInt(ageSlider.noUiSlider.get()[1])
                }
            }, () => {
                this.props.filter(this.state.inputs);
            });
        },50));

        var radiusSlider = document.getElementById('radiusRange');        
        noUiSlider.create(radiusSlider, {
            start: [5],
            connect: [true, false],
            step: 1,
            range: {
                min: 0,
                max: 10
            },
            format: this.formatRange()
        })
        var radiusText = document.getElementById('radiusText');
        radiusText.innerHTML = radiusSlider.noUiSlider.get();
        radiusSlider.noUiSlider.on('change', debounce((values, handle) => {
            var value = radiusSlider.noUiSlider.get();
            radiusText.innerHTML = value;
            this.setState({inputs: {...this.state.inputs, radius: parseInt(value)}}, () => {
                this.props.filter(this.state.inputs);
            });
        },50));
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
                    <input id="filterAddressInput" type="text" name="address" className="text-field" required/>
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
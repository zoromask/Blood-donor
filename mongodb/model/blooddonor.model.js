import PropTypes from 'prop-types';
module.exports = Blooddonor.PropTypes = {
    id: PropTypes.string,
    fullName: PropTypes.string,
    address: PropTypes.string,
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    phone: PropTypes.string,
    age: PropTypes.number,
    bloodType: PropTypes.string,
    height: PropTypes.number,
    weight: PropTypes.number,
}

module.exports = BlooddonorFiltering.PropTypes = {
    longitudeMin: PropTypes.number,
    longitudeMax: PropTypes.number,
    latitudeMin: PropTypes.number,
    latitudeMax: PropTypes.number,
    ageFrom: PropTypes.number,
    ageTo: PropTypes.number,
    bloodType: PropTypes.string,
}
var env = process.env.NODE_ENV || 'development';
var API_URI = env === 'development' ? "http://localhost:5000" : "https://blood-donor-api.herokuapp.com";
var API_GOOGLE_URI = env === 'development' ? "http://maps.googleapis.com" : "https://maps.googleapis.com";

exports.API_URI = API_URI;
exports.API_GOOGLE_URI = API_GOOGLE_URI;





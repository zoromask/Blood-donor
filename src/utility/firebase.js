import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyAdQxBrCDERpSFOxlM1HaqWaxBl9C3lp0c",
    authDomain: "blood-donor-fbd93.firebaseapp.com",
    databaseURL: "https://blood-donor-fbd93.firebaseio.com",
    projectId: "blood-donor-fbd93",
    storageBucket: "blood-donor-fbd93.appspot.com",
    messagingSenderId: "303358279952"
};
var fire = firebase.initializeApp(config);
export default fire;
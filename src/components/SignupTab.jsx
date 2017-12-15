import React, { Component } from 'react';
import firebase from 'firebase';


class InfoTab extends Component {
    constructor(props) {
        super(props);
        this.logInWithFb.bind(this);
        this.logInWithGoolge.bind(this);
        this.state = {
            login: false
        };
    }

    logInWithGoolge() {
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    }

    logInWithFb() {
        let provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider);
    }

    logOut() {
        firebase.auth().signOut();
    }

    render() {
        if (this.state.login) {
            return (
                <div>
                    <button onClick={this.logOut}>Log Out </button>
                </div>
            );
        } else {
            return (
                <div className="login-box">
                    <button className="social-signin facebook" onClick={this.logInWithFb}>Log in with facebook</button>
                    <button className="social-signin google" onClick={this.logInWithGoolge}>Log in with Google+</button>
                </div>
            );
        }
    }
}

export default InfoTab;

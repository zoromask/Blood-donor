import React, { Component } from 'react';
import fire from '../utility/firebase';
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

    componentWillMount() {
        var me = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.setState({
                    login: true
                });
                console.log('login');
            } else {
                me.setState({
                    login: false
                });
                console.log("signout");
            }
        });
    }

    logInWithGoolge() {
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // cons
        }).catch(function (error) {

        });
    }

    logInWithFb() {
        let provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {

        }).catch(function (error) {

        });
        console.log("fb");
    }

    logOut() {
        firebase.auth().signOut().then(function () {
            console.log('signout');
        }, function (error) {
            console.log('error');
        });
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

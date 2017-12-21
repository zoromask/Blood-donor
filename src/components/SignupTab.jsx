import React, { Component } from 'react';

const InfoTab = (props) => {
    const {login, isLoggedIn} = props
    
    if(!isLoggedIn)
        return(
            <div className="login-box">
                <button className="social-signin facebook" onClick={()=>login('fb')}>Log in with facebook</button>
                <button className="social-signin google" onClick={()=>login('gp')}>Log in with Google+</button>
            </div>
        )
}
export default InfoTab;

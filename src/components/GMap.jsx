import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class GMap extends Component{
  render(){
    const {route} = this.props
    return (
      <div className="map-container">
        Map here
      </div>
    )
  }
}
export default GMap;
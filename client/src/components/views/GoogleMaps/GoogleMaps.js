import React, { Component } from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

export class GoogleMaps extends Component {

  state = {
    address: '',
    city: '',
    area: '',
    state: '',
    zoom: 14,
    height: 400,
    mapPosition: {
      lat: 37.5501138, lng: 126.9922132
    },
    markerPosition: {
      lat: 37.5501138, lng: 126.9922132
    },
  }

  render() {
    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={this.state.zoom}
        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
      >
        <Marker
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
        >
          <InfoWindow >
            <div>handleLogout</div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    ));

    return (
      <MapWithAMarker
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFYDtLT_mOBoUggaRHn-wtKwdI_B0OUHY&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    )
  }
}

export default GoogleMaps



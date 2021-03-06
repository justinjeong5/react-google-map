import React, { Component } from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import Geocode from 'react-geocode';
import { Descriptions } from 'antd';
import AutoComplete from 'react-google-autocomplete';

Geocode.setApiKey('AIzaSyBFYDtLT_mOBoUggaRHn-wtKwdI_B0OUHY')

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

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          mapPosition: {
            lat: position.coords.latitude, lng: position.coords.longitude
          },
          markerPosition: {
            lat: position.coords.latitude, lng: position.coords.longitude
          }
        }, this.setGeoCode(position.coords.latitude, position.coords.longitude))
      })
    } else {
      this.setGeoCode(this.state.mapPosition.lat, this.state.mapPosition.lng);
    }
  }

  setGeoCode = (newLat, newLng) => {
    Geocode.fromLatLng(newLat, newLng).then(response => {
      const address = response.results[0].formatted_address,
        addressArray = response.results[0].address_components,
        city = this.getCity(addressArray),
        area = this.getArea(addressArray),
        state = this.getState(addressArray);
      this.setState({
        address,
        city,
        area,
        state,
        mapPosition: {
          lat: newLat, lng: newLng
        },
        markerPosition: {
          lat: newLat, lng: newLng
        }
      });
    })
  }

  getCity = (addressArray) => {
    const list = addressArray.filter((value) => {
      return value.types.includes("administrative_area_level_1");
    });
    return list[0]?.long_name;
  }

  getArea = (addressArray) => {
    let list = addressArray.filter((value) => {
      return value.types.includes("sublocality_level_1");
    });
    list = list.concat(addressArray.filter((value) => {
      return value.types.includes("locality");
    }))
    return list[0]?.long_name;
  }

  getState = (addressArray) => {
    const list = addressArray.filter((value) => {
      return value.types.includes("sublocality_level_2");
    });
    return list[0]?.long_name;
  }

  onMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    this.setGeoCode(newLat, newLng);
  }

  onPlaceSelected = (place) => {
    if (place.geometry) {
      this.setGeoCode(place.geometry.location.lat(), place.geometry.location.lng())
    }
  }

  render() {
    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={this.state.zoom}
        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}

      >
        <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
        >
          <InfoWindow >
            <div>{this.state.address}</div>
          </InfoWindow>
        </Marker>
        <AutoComplete
          style={{ width: '100%', height: 40, paddingLeft: 16, marginTop: 2, marginBottom: '2rem' }}
          onPlaceSelected={this.onPlaceSelected}
        />
      </GoogleMap>
    ));

    return (
      <>
        <div style={{ padding: '1rem', margin: '0 auto', maxWidth: 1000 }}>
          <Descriptions bordered>
            <Descriptions.Item label="시/도">{this.state.city}</Descriptions.Item>
            <Descriptions.Item label="시/구/군">{this.state.area}</Descriptions.Item>
            <Descriptions.Item label="동/읍/면">{this.state.state}</Descriptions.Item>
            <Descriptions.Item label="주소" span={3}>
              {this.state.address}
            </Descriptions.Item>
          </Descriptions>

          <MapWithAMarker
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFYDtLT_mOBoUggaRHn-wtKwdI_B0OUHY&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </>
    )
  }
}

export default GoogleMaps



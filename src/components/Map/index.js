import React, { Component, Fragment } from 'react'
import { View, Image } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import { LocationBox, LocationTex, LocationTimeBox, LocationTimeText, LocationTimeTextSmall, Back } from './styles';

import markerimage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import Search from '../Search/index';
import Directions from '../Directions/index';
import Details from '../Details/index';

import { getPixelsSize } from '../../utils';

Geocoder.init('AIzaSyBh4ngGGfWpd5CqByYyy149cd_QB6VPrd8')

export class Map extends Component {

  state = {
    region: null,
    destination: null,
    duration: null,
    location: null
  };

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(','));

        this.setState({ location, region: { latitude, longitude, latitudeDelta: 0.143, longitudeDelta: 0.0134 } });
      },

      (err) => { },

      {
        timeout: 8000,
        // enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  }

  handleLocationSelected = (data, { geometry }) => {

    const { location: { lat: latitude, lng: longitude } } = geometry;

    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    })
  };

  handleBack = () => {
    this.setState({destination: null})
  };

  render() {
    const { region, destination, duration, location } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => this.mapView = el}>

          {destination && (
            <Fragment>

              <Directions
                origin={region}
                destination={destination}
                onReady={(result) => {
                  this.setState({ duration: Math.floor(result.duration) })
                  this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: getPixelsSize(60),
                      left: getPixelsSize(60),
                      top: getPixelsSize(60),
                      bottom: getPixelsSize(360),
                    }
                  });
                }}
              />
              <Marker
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={markerimage}
              >
                <LocationBox>
                  <LocationTex>{destination.title}</LocationTex>
                </LocationBox>
              </Marker>

              <Marker
                coordinate={region}
                anchor={{ x: 0, y: 0 }}
              >
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>{duration}</LocationTimeText>
                    <LocationTimeTextSmall>Min</LocationTimeTextSmall>
                  </LocationTimeBox>

                  <LocationTex>{location}</LocationTex>
                </LocationBox>
              </Marker>
            </Fragment>
          )}
        </MapView>

        {destination ? (
          <Fragment>
            <Back onPress={this.handleBack}>
              <Image source={backImage}/>
            </Back>
            <Details />
          </Fragment>
        ) : 
          <Search onLocationSelected={this.handleLocationSelected} />}
      </View>
    )
  }
}

export default Map;

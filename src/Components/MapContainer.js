import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import "../index.css";
import { Container, Row, Col } from "react-bootstrap";
import CommentColumn from "./CommentColumn";
import InfoWindowCustom from "./InfoWindowCustom";
import AddSpotForm from "./AddSpotForm";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-google-places-autocomplete";

/*
TODO: https://stackoverflow.com/questions/51967477/my-google-map-refreshes-every-time-when-i-click-on-a-marker
    Stop refresh every time onclick event occurs
*/

export class MapContainer extends React.Component {
  state = {
    showInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    activeComment: {},
    hideAddPlace: true,
    userInputPlace: null
  };

  onMarkerClick = (props, marker, e) => {
    let comment;
    try {
      comment = marker.comments;
    } catch {
      comment = null;
    }
    console.log("[onMarkerClick]", props);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showInfoWindow: true,
      activeComment: comment
    });
  };

  onMapClicked = props => {
    if (this.state.showInfoWindow) {
      this.setState({
        showInfoWindow: false,
        selectedPlace: {},
        activeMarker: null,
        activeComment: {},
        hideAddPlace: true,
        userInputPlace: null
      });
    }
  };

  // Onclick for AddMe button
  addMeOnClicked = () => {
    this.setState({
      hideAddPlace: false
    });
  };
  handleChangeLocation = val => {
    // TODO: set the state
    // TODO: in render, create this marker.
    console.log("[HandleLocChange]", val);
    if (val !== null) {
      let latLng;
      geocodeByAddress(val["label"])
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          console.log("[MapContainer][handleChangeLocation]Got lat lng ", {
            lat,
            lng
          });
          this.setState({
            userInputPlace: {
              markerVal: val.value,
              location: { lat: lat, lng: lng }
            }
          });
        });
    } else {
      this.setState({
        userInputPlace: null
      });
    }
    // TODO
    // change the active marker, change the view of the map
  };

  render() {
    const style = {};
    //Need this so the container doesnt hide the other elements
    const containerStyle = {
      position: "relative",
      clear: "both",
      height: "100%"
    };

    // const markerDetails = [
    //     {title:"Place 1", name:"Cheese", position :{ lat: 37.778519, lng: -122.40564 }, key: "0"},
    //     {title:"Place 1", name:"Cheese", position :{ lat: 37.778519, lng: -122.43564 }, key: "1"}
    // ]

    // const comments = [
    //     {"aaronr22": {"comment": "Love the pizza", "tags": "Cheap"}},
    //     {"aaronr22": {"comment": "Love the pizza", "tags": "Cheap"}}
    // ];
    let mapCenterCurrentLocation;
    let initialCenter;
    if (this.props.mapCenter !== undefined) {
      initialCenter = this.props.mapCenter;
      mapCenterCurrentLocation = false;
    } else {
      initialCenter = { lat: 40.7128, lng: -74.006 };
      mapCenterCurrentLocation = true;
    }

    let addSpot;
    if (!this.state.hideAddPlace) {
      addSpot = (
        <div>
          <AddSpotForm
            currentUser={this.props.currentUser}
            marker={this.state.activeMarker}
          />
        </div>
      );
    }

    let autocomplete;
    if (this.props.guideOwner === this.props.currentUser) {
      console.log("[MapContainer][Autocomplete]");
      autocomplete = (
        <div>
          <GooglePlacesAutocomplete
            selectProps={{
              placeholder: "Search for a place, trailhead, resturant...",
              isClearable: true,
              onChange: val => {
                this.handleChangeLocation(val);
              },
              value: this.state.location
            }}
            name="map-location"
            apiKey={process.env.REACT_APP_GOOGLE_PLACES}
          />
        </div>
      );
    }

    let userMarker;
    if (this.state.userInputPlace) {
      let tmp = this.state.userInputPlace;
      console.log(tmp);
      userMarker = (
        <Marker
          key={tmp.markerVal.place_id}
          name={tmp.markerVal.description}
          position={tmp.location}
          onClick={this.onMarkerClick}
          g_id={tmp.markerVal.place_id}
          comments={{}}
        />
      );
      initialCenter = tmp.location;
    }

    console.log("[MapContainer] render", initialCenter);

    // Logic for passing all comments or jsut one comment to the comment col
    if (this.props.guideOwner) {
      console.log("[MapCOntainer][Guide][Comment Logic]", typeof(this.props.markerDetails))
      // Iterate through MarkerDetails and grab each of the 'comments'. throw them intwo a list
      let comment_list = []

      // Going to be a completely different structure, need to add the resturant name. Also means we need a new comment layout

    }
    return (
      <div>
        <Container fluid className="mapContainerContainer">
          <Container>{addSpot}</Container>
          <Row>
            <div className="col-md-9 col-sm-12 col-xs-12">
              <div className="mapContainer">
                <div className="autocomplete">{autocomplete}</div>
                <Map
                  initialCenter={initialCenter}
                  center={initialCenter}
                  containerStyle={containerStyle}
                  centerAroundCurrentLocation={false}
                  style={style}
                  zoom={10}
                  google={this.props.google}
                  onClick={this.onMapClicked}
                >
                  {this.props.markerDetails.map((marker, index) => (
                    <Marker
                      key={index}
                      name={marker.name}
                      position={{
                        lat: marker.location.lat,
                        lng: marker.location.lng
                      }}
                      onClick={this.onMarkerClick}
                      g_id={marker.g_id}
                      comments={marker.comments}
                    />
                  ))}

                  {userMarker}

                  <InfoWindowCustom
                    onClose={this.onMapClicked}
                    marker={this.state.activeMarker}
                    visible={this.state.showInfoWindow}
                  >
                    <div>
                      <h1>{this.state.selectedPlace.name}</h1>
                      <button type="button" onClick={this.addMeOnClicked}>
                        add me
                      </button>
                    </div>
                  </InfoWindowCustom>
                </Map>
              </div>
            </div>

            {/* Comment column goes below */}
            <div className="col-md-3 col-sm-12 col-xs-12">
              <CommentColumn
                comments={this.state.activeComment}
                title={this.state.selectedPlace.name}
              />
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_WRAPPER
})(MapContainer);

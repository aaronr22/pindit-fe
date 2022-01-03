import React, { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-google-places-autocomplete";
import { Modal } from "react-bootstrap";

const CreateNewList = props => {
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState(null);
  const [show, setShow] = useState(true);
  const [locationText, setLocationText] = React.useState(null);
  const handleClose = () => {
    console.log("[CreateNewList][HandleClose]")
    props.handleClose()
    setShow(false);
  }
  var handleChange = event => {
    const target = event.target;
    const value = target.value;
    // const name = target.name;

    console.log("[CreateNewList] Value:", value);
    setTitle(value);
  };

  var handleChangeLocation = val => {
    setLocationText(val)
    let addressText;
    geocodeByAddress(val["label"])
      .then(results => getLatLng(results[0]))
      .then(({lat, lng}) => {
        console.log("GOt lat lng ", { lat, lng });
        setLocation({ lat: lat, lng: lng });
        setLocationText(val)
      });
  };

  var handleSubmit = event => {
    event.preventDefault();
    console.log("[CreateNewList] handleSubmit");
    const data = { title: title, location: location };
    console.log("[HandleSubmit] data:", data);
    props.onSubmit(data);
  };



  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create your own list!</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit} className="w-75">
        <label>
          Title
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={title}
          />
        </label>
        <label className="w-50">
          Location
          <GooglePlacesAutocomplete
            selectProps={{
              isClearable: true,
              onChange: val => {
                handleChangeLocation(val);
              },
              value: locationText
            }}
            name="location"
            apiKey={process.env.REACT_APP_GOOGLE_PLACES}
          />
        </label>
        <div className="modal-footer">
          <button type="submit" value="submit">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateNewList;

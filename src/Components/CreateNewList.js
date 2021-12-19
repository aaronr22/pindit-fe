import React, { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-google-places-autocomplete";

const CreateNewList = props => {
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState(null);

  var handleChange = event => {
    const target = event.target;
    const value = target.value;
    // const name = target.name;

    // console.log(value, name);
    setTitle(value);
  };

  var handleChangeLocation = val => {
    geocodeByAddress(val["label"])
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("GOt lat lng ", { lat, lng });
        setLocation({ lat: lat, lng: lng });
      });
  };

  var handleSubmit = event => {
    event.preventDefault();
    console.log("[CreateNewList] handleSubmit");
    const data = { title: title, location: location };
    props.onSubmit(data);
  };

  return (
    <div>
      <h3>Add a guide!</h3>
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
              value: location
            }}
            name="location"
            apiKey={process.env.REACT_APP_GOOGLE_PLACES}
          />
        </label>

        <button type="submit" value="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateNewList;

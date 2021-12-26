import React from "react";
import axios from "axios";
import CreateNewList from "./CreateNewList";
import "../index.css";
import Cookies from "universal-cookie";
import {Modal} from "react-bootstrap";

export class AddSpotForm extends React.Component {
  constructor(props) {
    console.log("[AddSpotForm] Constructor...");
    super(props);
    this.state = {
      comment: "",
      guide: "default",
      userItins: [],
      showCreateList: false
    };

    this.cookies = new Cookies();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postNewList = this.postNewList.bind(this);
    this.onSubmitNewList = this.onSubmitNewList.bind(this);
    this.postNewSpot = this.postNewSpot.bind(this);
  }

  async postNewList(d) {
    console.log("[PostNewList]");
    var self = this;
    const data = d;
    console.log("[postnewlist] data", typeof data, data);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("access_token")}`

    };
    await axios
      .post(process.env.REACT_APP_BE_URL + "/submit_new_trip", data, {headers:headers})
      .then(function(response) {
        console.log("[AddSpotForm] Success!");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // OnSubmit Function for CreateNewList
  onSubmitNewList(data) {
    // TODO: what happens when submit happens?
    // 1. Post request: follow form from main.js:111 document.getElementById("guideSubmit")
    // 2. Call getUserItins
    console.log("[AddSpotForm][CreateNewList]", data);

    const d = {
      title: data.title,
      tags: "",
      auto_details: { location: data.location }
    };

    console.log(d);
    // this.postNewList(JSON.stringify(d));
    this.postNewList(d);
    this.getUserItins();
  }

  // To make this work, i changed the server to look for data in the form of data:{data:value}
  async getUserItins() {
    var self = this;
    console.log("[AddSpotForm] Await axios...", localStorage.getItem("access_token"));
    const data = {
      data: this.cookies.get("user")
    }; // changed from this.props.currentUser
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("access_token")}`
    };
    console.log("headers", headers)
    await axios
      .post(
        process.env.REACT_APP_BE_URL + "/get_user_itins", data,
        {headers: headers}
      )
      .then(function(response) {
        const itins = response.data; //type: string
        console.log(itins, typeof(itins))
        //const itins_parsed = JSON.parse(itins.replaceAll(/'/g, `"`)); // Parse to list and replace single qoute with double for the parser
        self.setState({
          userItins: itins,
          showCreateList: false
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount() {
    console.log("[AddSpotFomn] Getting itins...");
    this.getUserItins();
  }

  async postNewSpot(d) {
    console.log("[PostNewSpot]");
    var self = this;
    const data = d;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("access_token")}`
    }
    await axios
      .post(process.env.REACT_APP_BE_URL + "/submitSpot", data, {headers:headers})
      .then(function(response) {
        console.log("success!");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handleSubmit(event) {
    console.log("Submitted add spot form");
    event.preventDefault();
    console.log("[HandleSpotSubmit]", this.props.marker);
    const data = {
      comment: this.state.comment,
      itinSelect: this.state.guide,
      spot_tags: "",
      spot_details: {
        id: this.props.marker.g_id,
        name: this.props.marker.name,
        geometry: {
          location: {
            lat: this.props.marker.position.lat(),
            lng: this.props.marker.position.lng()
          }
        }
      }
    }; //TODO
    this.postNewSpot(data);
    this.setState({
      showCreateList: false
    });

    console.log(this.state);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(value, name);
    this.setState({
      [name]: value
    });
  }
  createListOnClick = () => {
    console.log("[AddSpotForm] create list on click");
    this.setState({
      showCreateList: true
    });
  };

  render() {
    const itins = this.state.userItins;
    const showCreateList = this.state.showCreateList;
    console.log("[AddSpotForm] Type of itins: ", typeof itins);
    let options;
    if (typeof itins !== undefined) {
      options = itins.map((itin, index) => (
        <option value={itin[1]}>{itin[0]}</option>
      ));
    }
    console.log("[AddSpotForm] showcreatelist value", showCreateList);
    let createList;
    if (showCreateList === true) {
      createList = <CreateNewList onSubmit={this.onSubmitNewList} />;
    }
    let submit;
    if (!this.cookies.get("user")) {
      console.log("[addspot][cookie] empty");
      submit = <input type="submit" value="Login to submit" disabled />;
    } else {
      console.log("[addspot][cookie]loggedin");
      submit = <input type="submit" value="submit" />;
    }
    return (
      <div className="addSpotForm">
        <h1>Add me form!</h1>
        {createList}
        <form onSubmit={this.handleSubmit}>
          <label>
            Comment
            <input
              type="text"
              name="comment"
              value={this.state.comment}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Choose your list
            <select
              name="guide"
              value={this.state.guide}
              onChange={this.handleChange}
            >
              <option disabled selected value="default">
                {" "}
                -- select an option --{" "}
              </option>
              {options}
            </select>
          </label>
          <span onClick={this.createListOnClick}>+ create new list</span>
          {submit}
        </form>
      </div>
    );
  }
}

export default AddSpotForm;

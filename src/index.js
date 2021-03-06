import ReactDOM from "react-dom";
import MapContainer from "./Components/MapContainer.js";
import CardGrid from "./Components/CardGrid";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import React from "react";
import axios from "axios";
import "./index.css";
import CommentColumn from "./Components/CommentColumn";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import { refreshTokenSetup } from "./utils/refreshToken";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Guide from "./routes/guides";
import Cookies from "universal-cookie";
import CreateUsername from "./Components/CreateUsername";
import CreateNewList from "./Components/CreateNewList";

class App extends React.Component {
  // hardcoding currentUser for now
  constructor(props) {
    super(props);
    this.state = {
      markerDetails: [],
      guideDetails: [],
      userLocation: {},
      currentUser: "",
      createUsername: false,
      showCreateList: false
    };
    this.cookies = new Cookies();
  }
  
   postNewList= async (d) => {
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
        self.handleClose()
      })
      .catch(function(error) {
        this.props.onAuthError(error)
        console.log(error);
      });
  }

  onSubmitNewList= (data) => {
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
  }


  createNewListOnClick = () => {
    //TODO
    this.setState({
      showCreateList: true
    });
  }

  createNewListOnSubmit = () => {
    //TODO
  }

  /*
    Get request to /get_all_spots
    Response: All the spots
    Gets the spots to create markers
  */
  async getMarkerDetails() {
    var self = this;
    console.log("Await axios...");
    await axios
      .get(process.env.REACT_APP_BE_URL +"/get_all_spots")
      .then(function(response) {
        self.setState({
          markerDetails: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

   handleCreateUsernameSubmit = async (val) => {
    var self = this;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("access_token")}`

    };
    await axios
      .post(process.env.REACT_APP_BE_URL +"/create_username", { username: val }, {headers:headers})
      .then(function(res) {
        // if its good, then hide the form
        if (res.data.type === "success") {
          // TODO: set cookie = to the username
          let u_name = res.data.username;
          // const cookies = new Cookies();
          self.cookies.set("user", u_name, { path: "/" });
          self.setState({
            createUsername: false,
            currentUser: u_name
          });
        } else {
        // if not good, keep the form and add an error message
        alert("Username already exists... or another error idk")
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  /*
      Get all the trips to make cards
    */
  async getGuideDetails() {
    var self = this;
    console.log("await axios guide");
    await axios
      .get(process.env.REACT_APP_BE_URL +"/get_all_trips")
      .then(function(response) {
        self.setState({
          guideDetails: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  /*
    Gets the users current location
  */
  getUserLocation() {
    var self = this;
    navigator.geolocation.getCurrentPosition(function(position) {
      var geoLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      self.setState({ userLocation: geoLocation });
    });
  }

  /*
      onSuccess function for login
    */
  onSuccess = async res => {
    const currentUser = res.profileObj.email;

    var self = this;
    console.log("Await axios...");
    await axios
      .post(process.env.REACT_APP_BE_URL +"/test_login", { token: res.tokenId })
      .then(function(response) {
        console.log("[Login]", response);
        if (response.data.status === "failure") {
          // TODO: smething
          self.onLogoutSuccess();
        } else if (response.data.create_user === "true") {
          self.setState({ createUsername: true });
        } else {
          console.log("[login][success] username:", response.data)
          // const cookies = new Cookies();
          localStorage.setItem('access_token', response.data.access_token)
          self.cookies.set("user", response.data.username, { path: "/" });
          self.setState({
            currentUser: response.data.username
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    refreshTokenSetup(res);
  };

  /*
  onSuccess for logout component
  */
  onLogoutSuccess = () => {
    //TODO: uncomment to remove hardcoding of currentUser
    localStorage.removeItem("access_token")
    this.cookies.remove("user")

    this.setState({
      currentUser: ""
    });

    alert("Logout made successfully");
  };


  componentDidMount() {
    this.getMarkerDetails();
    this.getGuideDetails();
    this.getUserLocation();
  }

  onAuthError = (error) => {
    if(error.response.status === 401) {
      this.onLogoutSuccess()
    } else {
      console.log(error)
    }
  }

  handleClose = () => {
    console.log("In handle close")
    this.setState({showCreateList: false});
  }

  render() {
    const markerDetails = this.state.markerDetails;
    const guideDetails = this.state.guideDetails;
    const userLocation = this.state.userLocation;
    const currentUser = this.state.currentUser;
    const showCreateList = this.state.showCreateList;

    // Logic to show Login or Logout component
    let loginButton;
    if (!('access_token' in localStorage)) {
      loginButton = (
        <Login style={{ float: "right" }} onSuccess={this.onSuccess} />
      );
    } else {
      loginButton = (
        <Logout style={{ float: "right" }} onSuccess={this.onLogoutSuccess} />
      );
    }

    let createUsername;
    if (this.state.createUsername) {
      createUsername = (
        <CreateUsername handleSubmit={this.handleCreateUsernameSubmit} />
      );
    }

    let createList;
    if(showCreateList === true) {
      createList = <CreateNewList onSubmit={this.onSubmitNewList} handleClose={this.handleClose}/>;
    }

    return (
      <div>
        <Container fluid>
          {createUsername}
          <div className="row justify-content-between">
            <Navbar fluid bg="dark" variant="dark">
              <div className="col">
                <a href="/"><h1>Pin'd It!</h1></a>
              </div>
              <div className="col">{loginButton}</div>
            </Navbar>
          </div>
        </Container>
       
        <div>
        <Container fluid>
          <div style={{ marginBottom: "1rem" }}>
          <div>
            <div>
            <h1>Explore</h1>
            <span className="title-sub-text">See your friends favorite places</span>

            <MapContainer
              markerDetails={markerDetails}
              currentUser={currentUser}
              userLocation={userLocation}
              onAuthError={this.onAuthError}
            />
            </div>
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-center w-75">
              <h1>Inspriation</h1>
            </div>
          </div>
          <div>
            <Row>
              <Col>
            <div className="d-flex justify-content-center w-75">
              <span className="title-sub-text">Check out your friends trips</span>
            </div>
            </Col>
            </Row>
          </div>
          </Container>
          <div>
            <Row>
            <Col className="col-md-9 col-xs-12">
              <CardGrid guideData={guideDetails} />
            </Col>
            <Col className="col-md-3">
            <span className="title-sub-text">Been somewhere cool?</span>
              <button className="btn btn-success" onClick={this.createNewListOnClick}>Create your own list!</button>
              {createList}
            </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/guides/:id" element={<Guide />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

/* Sample data

    const guideData = [
      { title: "Title one", user: "aaron", clicks: "7", id: "0" },
      { title: "Jackson Hole", user: "george", clicks: "15", id: "1" },
      { title: "New Hampshire", user: "tim", clicks: "23", id: "2" },
      { title: "Green Mountains", user: "harry", clicks: "11", id: "3" },
      { title: "Gunnison NP", user: "brb980", clicks: "10", id: "4" }
    ];

    const markerDetails = [
        {title:"Place 1", name:"Cheese", position :{ lat: 37.778519, lng: -122.40564 }, g_id: "0"},
        {title:"Place 2", name:"Hi You", position :{lat: 37.77855, lng: -121.40564 }, g_id: "1"},
        {title:"Place 3", name:"Nikkis noodles", position :{lat: 37.778519, lng: -123.40000 }, g_id: "2"},
        {title:"Place 4", name:"Joes", position :{lat: 37.978400, lng: -122.40564 }, g_id: "3"}
    ];

*/

import React from "react";
import axios from "axios";
import MapContainer from "./MapContainer";
import { Container, Navbar } from "react-bootstrap";
import "../index.css";
import {useParams} from "react-router-dom";
import Cookies from 'universal-cookie';

const GuideContainer = (props) => {
  console.log("[GuideContainer] props", props)
  const cookies = new Cookies()
  console.log("[guidecontainer][cookie]",cookies.get('user'));
  let params = useParams();
  const [markerDetails, setMarkerDetails] = React.useState([]);
  const [meta, setMeta] = React.useState({});
  const [mapCenter, setMapCenter] = React.useState(undefined);
  const [guideOwner, setGuideOwner] = React.useState("");

  React.useEffect(() => {
    console.log("[GuideContainer][ComponentDidMount]")
    getMarkerDetails();
  }, []);

  async function getMarkerDetails() {
    console.log("[GuideContainer][getMarkerDetails]")
    let url = "/" + params.id;
    await axios
      .get(url)
      .then(function(response) {
        console.log("[GuideContainer] data: ", response.data);
        setMarkerDetails(response.data.results.data);
        setMeta(response.data.meta);
        setMapCenter({
          lat: response.data.results.location.lat,
          lng: response.data.results.location.long
        });
        setGuideOwner(response.data.meta.name);

        console.log("State did update!");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  return (
    <div>
      <Container fluid>
        <div className="row justify-content-between">
          <Navbar fluid bg="dark" variant="dark">
            <div className="col">
              <h1>Pin'd It!</h1>
            </div>
          </Navbar>
        </div>
      </Container>
      <Container>
        <h1> {meta.title}</h1>
        <span class="title-sub-text">by {meta.name}</span>
        <MapContainer
          markerDetails={markerDetails}
          mapCenter={mapCenter}
          guideOwner={guideOwner}
          currentUser={cookies.get('user')}
        />
      </Container>
    </div>
  );
};

export default GuideContainer;

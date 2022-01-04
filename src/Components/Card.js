import React from "react";
import Card from "react-bootstrap/Card";
import classes from "./Card.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const GuideCard = props => {
  var path =
    "/images/card_background_" + Math.floor(Math.random() * 9) + ".png";
  return (
    <Card
      className={classes.guidecard}
      style={{ backgroundImage: `url(${path})` }}
    >
      <Card.Body>
        <div className={classes.cardBody}>
          <Link to={"/guides/" + props.id} key={props.id} className="stretched-link" target="_blank">
            {props.title}
          </Link>
        </div>
      </Card.Body>
      <Card.Footer>
        <a>created by {props.user}</a>
        <h6>{props.clicks} visits!</h6>
      </Card.Footer>
    </Card>
  );
};

export default GuideCard;

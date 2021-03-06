import React from "react";
import { BsXCircle } from "react-icons/bs";
import { Container, Row, Col } from "react-bootstrap";
import "../index.css";
import Cookies from "universal-cookie";

export default Comment = props => {
  const cookies = new Cookies();
  let user = cookies.get("user");
  var onClickRemove = () => {
    //todo func to remove the comment, positioning
    console.log("[comment][remove pin]");
  };

  let minus;
  if (props.user === user) {
    minus = (
      <BsXCircle
        color="red"
        className="w-25 xsvg"
        onClick={onClickRemove}
      />
    );
  }
  return (
    <div>
      <Container className="commentContainer">
        <Row>
          <Col>
          <div className="col-9">
            <span className="comment text-wrap">
              {props.comments[props.user].comment}
            </span>
          </div>
          <div className="col-3 x">{minus}</div>
          </Col>
        </Row>
        <Row className="align-self-end">
        <Col>
          <span className="comment-title">by {props.user}</span>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

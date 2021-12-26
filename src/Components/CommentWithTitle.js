import React from "react";
import { Container, Row } from "react-bootstrap";
import "../index.css";
import Cookies from "universal-cookie";

const CommentWithTitle = props => {
  const cookies = new Cookies();
  let user = cookies.get("user");

  return (
    <div>
      <Container className="commentContainer">
        <Row>
          <div className="col-9">
            <span className="comment text-wrap">{props.comment}</span>
          </div>
        </Row>
        <Row className="align-self-end">
          <span className="comment-title">{props.name}</span>
        </Row>
      </Container>
    </div>
  );
};

export default CommentWithTitle;

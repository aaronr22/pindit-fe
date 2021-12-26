import React from "react";
import Comment from "./Comment";
import { Row, Container, Col } from "react-bootstrap";
import CommentWithTitle from "./CommentWithTitle";
// "comments": {"aaronr22": {"comment": "Love the pizza", "tags": "Cheap"}}
const CommentColumn = props => {
  var dictToList = dict => {
    var returnList = [];
    for (var i = 0; i < Object.keys(dict).length; i++) {
      var k = Object.keys(dict)[i];
      var tmpObj = {};
      tmpObj[k] = dict[k];
      returnList.push(tmpObj);
    }
    return returnList;
  };

  let c;
  if (props.hasOwnProperty("comments")) {
    var commentList = dictToList(props.comments);
    c = commentList.map(row => (
      <Comment comments={row} user={Object.keys(row)[0]} />
    ));
  } else {
    // Do comment_list stuff here
    c = props.comment_list.map(row => (
      <CommentWithTitle name={row[0]} comment={row[1]} />
    ));
  }

  return (
    <div>
      <Container>
        <Row className="justify-content-center">
          <Col>
            <h3 className="commentColumnTitle  ">{props.title}</h3>
          </Col>
        </Row>
        <Row>
          <Col>{c}</Col>
        </Row>
      </Container>

    </div>
  );
};

export default CommentColumn;

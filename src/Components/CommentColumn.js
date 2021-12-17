import React from "react";
import Comment from "./Comment";
import { Row, Container } from "react-bootstrap";
// "comments": {"aaronr22": {"comment": "Love the pizza", "tags": "Cheap"}}
const CommentColumn = props => {
  var dictToList = dict => {
    var returnList = [];
    // console.log("Comment dict: ", dict)
    for (var i = 0; i < Object.keys(dict).length; i++) {
      //    console.log("Object.keys:", Object.keys(dict)[i])
      var k = Object.keys(dict)[i];
      var tmpObj = {};
      tmpObj[k] = dict[k];
      returnList.push(tmpObj);
    }
    console.log("Return list: ", returnList);
    return returnList;
  };

  var commentList = dictToList(props.comments);

  return (
    <div>
      <Container>
        <Row className="justify-content-center">
          <h3 className="commentColumnTitle  ">{props.title}</h3>
        </Row>
      </Container>
      {commentList.map(row => (
        <Comment comments={row} user={Object.keys(row)[0]} />
      ))}
    </div>
  );
};

export default CommentColumn;

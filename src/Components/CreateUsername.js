import React, {useState} from "react";
import { Modal, Container, Button } from "react-bootstrap";
const CreateUsername = props => {
  const [show, setShow] = useState(true);
  const [username, setUsername] = useState("")

  const handleChange = event => {
    console.log(event.target.value)
    setUsername(event.target.value)
  }

  const handleSubmit = event => {
      event.preventDefault();
        props.handleSubmit(username)
  }

   const handleClose = () => setShow(false);
  return (
    <Container>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static" keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Create username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <input type="text" name="username" value={username} onChange={handleChange} value={username} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateUsername;
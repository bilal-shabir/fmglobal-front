import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  FormSelect,
  Container,
  Row,
  Col,
} from "shards-react";


class AddUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <Container  fluid className="main-content-container px-4">
        <>
          <Button variant="success" onClick={this.handleShow}>
            Add Users
          </Button>

          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.show}
          >
            <Modal.Header>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul class="list-group list-group-flush">
                <li class="list-group-item p-3">
                  <div class="row">
                    <div class="col-sm-12 col-md-6">
                      <strong class="text-muted d-block mb-2">Forms</strong>
                      <form>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="First Name"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">
                                @
                              </span>
                            </div>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Username"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>

                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Phone"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>

                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            id="inputAddress"
                            placeholder="1234 Main St"
                            value="7898 Kensington Junction, New York, USA"
                          />{" "}
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-7">
                            <input
                              type="text"
                              class="form-control"
                              id="inputCity"
                              value="Signal Token"
                            />{" "}
                          </div>
                          <div class="form-group col-md-5">
                            <select id="inputState" class="form-control">
                              <option selected>OnM Team</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div class="col-sm-12 col-md-6">
                      <strong class="text-muted d-block mb-2">
                        Form Validation
                      </strong>
                      <form>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Last Name"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>
                        <div class="form-group">
                          <input
                            type="password"
                            class="form-control"
                            id="inputPassword4"
                            placeholder="Password"
                            value="myCoolPassword"
                          />{" "}
                        </div>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Staff ID"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-6">
                            <select class="form-control ">
                              <option selected>Admin</option>
                              <option>...</option>
                            </select>
                          </div>
                          <div class="form-group col-md-6">
                            <select class="form-control ">
                              <option selected>Active</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <select class="form-control ">
                              <option selected>Permissions</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </Container>
    );
  }
}

export default AddUserModal;

import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default () => {
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const show_add_modal = () => {
        setShow(true)
    }
    const close_add_modal =()=>{
        setShow(false)
    }
    return (
        <div>
            <button 
                onClick={show_add_modal} 
                class="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i class="large material-icons">add</i>{t('add_customer_button')}
            </button>
            <Modal
                show={show}
                onHide={close_add_modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('add_customer_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ul class="list-group list-group-flush">
                <li class="list-group-item p-3">
                  <div class="row">
                    <div class="col-sm-12 col-md-6">
                      <form>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Full Name*"
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
                              type="email"
                              class="form-control"
                              placeholder="Email*"
                              aria-label="email"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                            />{" "}
                          </div>
                        </div>

                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Mobile Number"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                            />{" "}
                          </div>
                        </div>

                        <div class="form-group">
                          <div class="input-group mb-3">
                            <select class="form-control ">
                              <option selected>Role</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                        
                      </form>
                    </div>
                    <div class="col-sm-12 col-md-6">
                      <form>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Nationality"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                            />{" "}
                          </div>
                        </div>
                        <div class="form-group">
                          <input
                            type="password"
                            class="form-control"
                            id="inputPassword4"
                            placeholder="Password*"
                            autoComplete="off"
                          />{" "}
                        </div>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="number"
                              class="form-control"
                              placeholder="CPR"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>
                        
                      </form>
                    </div>
                  </div>
                </li>
              </ul>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
        
    );
}


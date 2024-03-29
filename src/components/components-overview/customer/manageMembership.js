import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default () => {
    const [membershipShow, setMembershipShow] = useState(false);
    const {t} = useTranslation()
    const show_membership_modal = () => {
        setMembershipShow(true)
    }
    const close_membership_modal =()=>{
        setMembershipShow(false)
    }
    return (
        <div>
            <button 
                onClick={show_membership_modal} 
                className="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i className="large material-icons">card_membership</i>{t('manage_membership_button')}
            </button>
            <Modal
                show={membershipShow}
                onHide={close_membership_modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('manage_membership_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ul className="list-group list-group-flush">
                <li className="list-group-item p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <form>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Full Name*"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="basic-addon1">
                                @
                              </span>
                            </div>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email*"
                              aria-label="email"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                            />{" "}
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Mobile Number"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />{" "}
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="input-group mb-3">
                            <select className="form-control ">
                              <option selected>Role</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                        
                      </form>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <form>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nationality"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              autocomplete="off"
                            />{" "}
                          </div>
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control"
                            id="inputPassword4"
                            placeholder="Password*"
                            autoComplete="off"
                          />{" "}
                        </div>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="number"
                              className="form-control"
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


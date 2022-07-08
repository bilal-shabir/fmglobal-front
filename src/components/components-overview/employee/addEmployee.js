import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";

export default ({refetch}) => {
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const name = useInputValue("")
    const email = useInputValue("")
    const mobile = useInputValue("")
    const nationality = useInputValue("")
    const CPR = useInputValue("")
    const password = useInputValue("")
    const show_add_modal = () => {
        setShow(true)
    }
    const close_add_modal =()=>{
        setShow(false)
    }
    function handleSubmit(event) {
      event.preventDefault(); 
      const body ={
        name: name.value,
        email: email.value,
        password: password.value,
        nationality: nationality.value,
        CPR: CPR.value,
        mobile: mobile.value
      }
      const options = {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body)
      }
      fetch(URL2+"employee", options)
      .then((res) =>  {
        if(!res.ok){
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then((res) => {
        refetch({})
        toast.success('Employee created successfully', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
      })
      .catch((err) => {
        toast.error('Error: Failed to create Empoyee', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
      });
      close_add_modal()
    }
    return (
        <div>
            <button 
                onClick={show_add_modal} 
                class="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i class="large material-icons">add</i>{t('add_employee_button')}
            </button>
            <Modal
                show={show}
                onHide={close_add_modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{marginLeft:'6%'}}
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('add_employee_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit }>
                <Modal.Body>
                
                <ul class="list-group list-group-flush">
                <li class="list-group-item p-3">
                  <div class="row">
                    <div class="col-sm-12 col-md-6">
                      <div>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Full Name*"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                              required
                              onChange={name.onChange}
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
                              required
                              onChange={email.onChange}
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
                              onChange={mobile.onChange}
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
                        
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-6">
                      <div>
                        <div class="form-group">
                          <div class="input-group mb-3">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Nationality"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                              onChange={nationality.onChange}
                            />{" "}
                          </div>
                        </div>
                        <div class="form-group">
                          <input
                            type="password"
                            class="form-control"
                            id="inputPassword4"
                            placeholder="Password*"
                            autocomplete="new-password"
                            required
                            onChange={password.onChange}
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
                              onChange={CPR.onChange}
                            />{" "}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
                </Modal.Body>
                <Modal.Footer>
                <button 
                class="btn btn-dark"  
                type="submit" 
                style={{ color:'#D79D12'}}
              >
                {t('save')}
              </button>
                </Modal.Footer>
                </form>
            </Modal>
        </div>
        
    );
}


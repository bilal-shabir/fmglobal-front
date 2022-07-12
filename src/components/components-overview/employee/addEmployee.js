import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput, FormSelect } from "shards-react";
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";
import { POST } from "../../API calls/POST";

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
      POST(URL2+"employee",body)
      refetch({})
      close_add_modal()
    }
    return (
        <div>
            <button 
                onClick={show_add_modal} 
                className="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i className="large material-icons">add</i>{t('add_employee_button')}
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
                
                <ul className="list-group list-group-flush">
                <li className="list-group-item p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <div>
                      <FormGroup>
                        <label htmlFor="#fullname">Full Name</label>
                        <FormInput 
                          type= "text"
                          id="#fullname"
                          placeholder="Full Name" 
                          autoComplete="off"
                          onChange={name.onChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#email">Email</label>
                        <FormInput 
                          type= "email"
                          id="#email"
                          placeholder="Email*" 
                          autoComplete="off"
                          onChange= {email.onChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#mobile">Mobile</label>
                        <FormInput 
                          type= "text"
                          id="#mobile"
                          placeholder="Mobile*" 
                          autoComplete="off"
                          onChange= {mobile.onChange}
                          required
                        />
                      </FormGroup>    
                        
                        
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div>
                      <FormGroup>
                        <label htmlFor="#nationality">Nationality</label>
                        <FormInput 
                          type= "text"
                          id="#nationality"
                          placeholder="Nationality*" 
                          autoComplete="off"
                          onChange= {nationality.onChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#password">Password</label>
                        <FormInput 
                          type= "password"
                          id="#password"
                          placeholder="Nationality*" 
                          autoComplete="new-password"
                          onChange= {password.onChange}
                          required
                        />
                      </FormGroup>  
                      <FormGroup>
                        <label htmlFor="#role">Role</label>
                          <FormSelect id="#role">
                            <option>Role</option>
                            <option>...</option>
                          </FormSelect>
                      </FormGroup>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
                </Modal.Body>
                <Modal.Footer>
                <button 
                className="btn btn-dark"  
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


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
    const description = useInputValue("")

    async function handleSubmit(event) {
      event.preventDefault(); 
      const body ={
        name: name.value,
        description: description.value,
      }
      await POST(URL2+"role",body, "Error: Failed to add employee" ,"Employee added successfully")
      refetch({})
      setShow(false)
    }
    return (
        <div>
            <button 
                onClick={()=>setShow(true)} 
                className="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i className="large material-icons">add</i>{t('add_role_button')}
            </button>
            <Modal
                show={show}
                onHide={()=>setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{marginLeft:'6%'}}
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('add_role_heading')}</span>
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
                        <label htmlFor="#fullname">Name</label>
                        <FormInput 
                          type= "text"
                          id="#fullname"
                          placeholder="Full Name" 
                          autoComplete="off"
                          onChange={name.onChange}
                          required
                        />
                      </FormGroup>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div>
                      <FormGroup>
                        <label htmlFor="#description">Description</label>
                        <FormInput 
                          type= "description"
                          id="#description"
                          placeholder="Description*" 
                          autoComplete="off"
                          onChange= {description.onChange}
                          required
                        />
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


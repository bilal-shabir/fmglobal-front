import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput } from "shards-react";
import { URL2 } from "../../../constants";
import { PUT } from "../../API calls/PUT";


export default ({data, refetch}) => {
    const [edit, setEdit] = useState(false);
    const {t} = useTranslation()
    const show_edit_modal = () => {
        setEdit(true)
    }
    const close_edit_modal =()=>{
        setEdit(false)
    }
    const handleEdit = async() =>{
      const body ={
        id: data.id,
        name: document.getElementById('#fullname').value,
        email: document.getElementById('#email').value,
        mobile: document.getElementById('#mobile').value,
        nationality: document.getElementById('#nationality').value,
        CPR: document.getElementById('#CPR').value
      }

      const edit = await PUT(URL2+'customer', body, "Error: Failed to update customer", "Customer details updated" )
      
      edit && close_edit_modal()
      refetch({})
      
    }
    return (
        <div>
            <button 
                onClick={show_edit_modal} 
                className="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i className="material-icons">edit</i>{t('edit_customer_button')}
            </button>
            <Modal
                show={edit}
                onHide={close_edit_modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{marginLeft:'6%'}}
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('edit_customer_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body 
                  style={{
                    maxHeight: 'calc(100vh - 210px)',
                    overflowY: 'auto'
                  }}
                >
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
                          defaultValue = {data.name}
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
                          defaultValue = {data.email}
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
                          defaultValue = {data.mobile}
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
                          defaultValue={data.nationality}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#CPR">CPR</label>
                        <FormInput 
                          type= "number"
                          id="#CPR"
                          placeholder="CPR*" 
                          autoComplete="new-password"
                          defaultValue={data.CPR}
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
                    onClick={()=>handleEdit(data.id)} 
                    className="btn btn-dark"  
                    type="button" 
                    style={{ color:'#D79D12'}}
                >
                   {t('save')}
                </button>
                </Modal.Footer>
            </Modal>
        </div>
        
    );
}


import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput } from "shards-react";
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";
import { PUT } from "../../API calls/PUT";


export default ({data, refetch}) => {
    const {t} = useTranslation()
    const name = useInputValue(data.name)
    const email = useInputValue(data.email)
    const mobile = useInputValue(data.mobile)
    const nationality = useInputValue(data.nationality)
    const CPR = useInputValue(data.CPR)
    // const is_deleted = useInputValue(data.is_deleted)

    const [edit, setEdit] = useState(false);
    const show_edit_modal = () => {
        setEdit(true)
    }
    const close_edit_modal =()=>{
        setEdit(false)
    }
    async function handleEdit (event){
      event.preventDefault(); 
      const body = {
        id: data.id,
        name: name.value,
        email: email.value,
        mobile: mobile.value,
        nationality: nationality.value,
        CPR: CPR.value
      }
      const update = await PUT(URL2+"employee",body, "Error: Failed to update details", "Details updated successfully")
      if(update){
        close_edit_modal()
      }
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
                <i className="material-icons">edit</i>{t('edit_employee_button')}
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
                    <span style={{color:'black'}}>{t('edit_employee_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleEdit}>
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
                          defaultValue={data.name}
                          onChange={name.onChange}
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
                          defaultValue={data.mobile}
                          onChange= {mobile.onChange}
                          required
                        />
                      </FormGroup>    
                        
                        
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div>
                      <FormGroup>
                        <label htmlFor="#email">Email</label>
                        <FormInput 
                          type= "text"
                          id="#email"
                          placeholder="Email*" 
                          autoComplete="off"
                          defaultValue={data.email}
                          onChange= {email.onChange}
                          required
                        />
                      </FormGroup>
                      {/* <FormGroup>
                        <label htmlFor="#nationality">Nationality</label>
                        <FormInput 
                          type= "text"
                          id="#nationality"
                          placeholder="Nationality*" 
                          autoComplete="off"
                          defaultValue={data.nationality}
                          onChange= {nationality.onChange}
                          required
                        />
                      </FormGroup> */}
                      {/* <FormGroup>
                        <label htmlFor="#role">Role</label>
                          <FormSelect id="#role">
                            <option>Role</option>
                            <option>...</option>
                          </FormSelect>
                      </FormGroup> */}
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


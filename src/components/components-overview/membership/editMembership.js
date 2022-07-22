import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput } from "shards-react";
import { URL2 } from "../../../constants";
import { PUT } from "../../API calls/PUT";


export default ({data, refetch, rtl}) => {
    const {t} = useTranslation()
    const [edit, setEdit] = useState(false);
    const show_edit_modal = () => {
        setEdit(true)
    }
    const close_edit_modal =()=>{
        setEdit(false)
    }
    function handleEdit (event){
      event.preventDefault(); 
      const body = {
        id: data.id,
        name: document.getElementById("#name").value,
        cost: document.getElementById("#cost").value,
        contract_duration: document.getElementById("#contract_duration").value,
        lodgings: document.getElementById("#lodgings").value,
        downpayment: document.getElementById("#downpayment").value,
        supervisor_commision: document.getElementById("#supervisor_commision").value,
        employee_commision: document.getElementById("#employee_commision").value
      }
      PUT(URL2+"membership",body, "Error: Failed to update membership details", "Details updated successfully")
      refetch({})
      close_edit_modal()
    }
    return (
        <div>
            <button 
                onClick={show_edit_modal} 
                className="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i className="material-icons">edit</i>{t('edit_membership_button')}
            </button>
            <Modal
                show={edit}
                onHide={close_edit_modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={rtl ? {marginLeft:'-6%'} : {marginLeft:'6%'}}
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('edit_membership_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleEdit}>
                <Modal.Body>
                <ul className="list-group list-group-flush">
                <li className="list-group-item p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <FormGroup>
                        <label htmlFor="#name ">Name</label>
                        <FormInput 
                          id="#name"
                          placeholder="Name" 
                          autoComplete="off"
                          required
                          defaultValue ={data.name}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#cost">Cost</label>
                        <FormInput 
                          type= "number"
                          id="#cost"
                          placeholder="Cost" 
                          autoComplete="off"
                          required
                          defaultValue ={data.cost}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#downpayment">Down Payment</label>
                        <FormInput 
                          type= "number"
                          id="#downpayment"
                          placeholder="Down Payment" 
                          autoComplete="off"
                          required
                          defaultValue ={data.downpayment}
                        />
                      </FormGroup> 
                      <FormGroup>
                        <label htmlFor="#supervisor_commision">Supervisor Commission</label>
                        <FormInput 
                          type= "number"
                          id="#supervisor_commision"
                          placeholder="Supervisor Commission" 
                          autoComplete="off"
                          defaultValue ={data.supervisor_commision}
                        />
                      </FormGroup>                   
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <FormGroup>
                        <label htmlFor="#lodgings">Lodgings</label>
                        <FormInput 
                          type= "number"
                          id="#lodgings"
                          placeholder="Loadgings" 
                          autoComplete="off"
                          required
                          defaultValue ={data.lodgings}
                        />
                      </FormGroup>    
                      <FormGroup>
                        <label htmlFor="#contract_duration">Contract Duration</label>
                        <FormInput 
                          type= "number"
                          id="#contract_duration"
                          placeholder="Contract Duration" 
                          autoComplete="off"
                          required
                          defaultValue ={data.contract_duration}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#employee_commision">Employee Commission</label>
                        <FormInput 
                          type= "number"
                          id="#employee_commision"
                          placeholder="Employee Commission" 
                          autoComplete="off"
                          defaultValue ={data.employee_commision}
                        />
                      </FormGroup>
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


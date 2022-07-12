import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput } from "shards-react";
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";
import { PUT } from "../../API calls/PUT";


export default ({data, refetch, rtl}) => {
  const {t} = useTranslation()
    const name = useInputValue(data.name)
    const cost = useInputValue(data.cost)
    const lodgings = useInputValue(data.lodgings)
    const contract_duration = useInputValue(data.contract_duration)
    const downpayment = useInputValue(data.downpayment)
    const employee_commision = useInputValue(data.employee_commision)
    const supervisor_commision = useInputValue(data.supervisor_commision)
    // const is_deleted = useInputValue(data.is_deleted)

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
        name: name.value,
        cost: cost.value,
        contract_duration: contract_duration.value,
        lodgings: lodgings.value,
        downpayment: downpayment.value,
        supervisor_commision: supervisor_commision.value ? supervisor_commision.value : null,
        employee_commision: employee_commision.value ? employee_commision.value : null
      }
      PUT(URL2+"membership",body)
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
                          onChange={name.onChange}
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
                          onChange={cost.onChange}
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
                          onChange={downpayment.onChange}
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
                          onChange={supervisor_commision.onChange}
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
                          onChange={lodgings.onChange}
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
                          onChange={contract_duration.onChange}
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
                          onChange={employee_commision.onChange}
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


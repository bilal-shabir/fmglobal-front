import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput } from "shards-react";
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";
import { POST } from "../../API calls/POST";

export default ({refetch, rtl}) => {
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const name = useInputValue(null)
    const cost = useInputValue(null)
    const lodgings = useInputValue(null)
    const contract_duration = useInputValue(null)
    const downpayment = useInputValue(null)
    const employee_commision = useInputValue(null)
    const supervisor_commision = useInputValue(null)
    const show_add_modal = () => {
        setShow(true)
    }
    const close_add_modal =()=>{
        setShow(false)
    }
    async function handleSubmit(event) {
      event.preventDefault(); 
      const lodgings = +document.getElementById("#lodgings").value;
      const contract = +document.getElementById("#contract_duration").value;
      
      if(lodgings % contract !==0){
      toast.info("contract duration is invalid for the specified lodgings", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
      });
        return
      }
        
      
      const body ={
        name: name.value,
        cost: cost.value,
        contract_duration: contract_duration.value,
        lodgings: lodgings.value,
        downpayment: downpayment.value,
        supervisor_commision: supervisor_commision.value ? supervisor_commision.value : null,
        employee_commision: employee_commision.value ? employee_commision.value : null
      }
      await POST(URL2+"membership", body ,"Error: Failed to create membership","Membership created successfully")
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
                <i className="large material-icons">add</i>{t('add_membership_button')}
            </button>
            <Modal
                show={show}
                onHide={close_add_modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={rtl ? {marginLeft:'-6%'} : {marginLeft:'6%'}}
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('add_membership_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit }>
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


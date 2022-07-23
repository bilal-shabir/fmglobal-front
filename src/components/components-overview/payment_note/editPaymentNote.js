import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput, FormSelect } from "shards-react";
import { URL2 } from "../../../constants";
import { PUT } from "../../API calls/PUT";


export default ({ data, refetch, rtl}) => {
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
        payment_date: document.getElementById("#payment_date").value,
        paid: (document.getElementById("#paid").value === "true"),
        amount: +document.getElementById("#amount").value,
        type:document.getElementById("#type").value,
      }
      PUT(URL2+"payment",body, "Error: Failed to update payment details", "Details updated successfully")
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
                    <span style={{color:'black'}}>{t('edit_payment_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleEdit}>
                <Modal.Body>
                
                <ul className="list-group list-group-flush">
                <li className="list-group-item p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <FormGroup>
                        <label htmlFor="#payment_date">Payment Date</label>
                        <FormInput 
                          type="date"
                          id="#payment_date"
                          // placeholder="Hotel Name*" 
                          autoComplete="off"
                          required
                          defaultValue = {moment(data.payment_date).format("YYYY-MM-DD")}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#paid">Payment Status</label>
                          <FormSelect id="#paid" required defaultValue={data.paid}>
                            <option value = {false}>unpaid</option>
                            <option value = {true}>paid</option>

                          </FormSelect>
                      </FormGroup>           
                    </div>
                    <div className="col-sm-12 col-md-6">
                    <FormGroup>
                        <label htmlFor="#amount">Amount</label>
                        <FormInput 
                          type= "number"
                          id="#amount"
                          // placeholder="Hotel Address*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.amount}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#type">Type</label>
                        <FormInput 
                          id="#type"
                          // placeholder="Hotel Address*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.type}
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

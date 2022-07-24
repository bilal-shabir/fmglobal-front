import moment from "moment";
import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput } from "shards-react";
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
        hotel_name: document.getElementById("#name").value,
        hotel_address: document.getElementById("#hotel_address").value,
        hotel_contact: document.getElementById("#hotel_contact").value,
        hotel_room_type:document.getElementById("#hotel_room_type").value,
        voucher_to: document.getElementById("#voucher_to").value,
        guests_number: +document.getElementById("#guests_number").value,
        start_date: document.getElementById("#start_date").value,
        end_date : document.getElementById("#end_date").value,
        // current_year_lodgings: +document.getElementById("#current_year_lodgings").value
      }

      PUT(URL2+"reservation",body, "Error: Failed to update reservation details", "Details updated successfully")
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
                    <span style={{color:'black'}}>{t('edit_reservation_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleEdit}>
                <Modal.Body>
                
                <ul className="list-group list-group-flush">
                <li className="list-group-item p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <FormGroup>
                        <label htmlFor="#name ">Hotel Name</label>
                        <FormInput 
                          id="#name"
                          placeholder="Hotel Name*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.hotel_name}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#hotel_contact ">Hotel Contact</label>
                        <FormInput 
                          id="#hotel_contact"
                          placeholder="Contact*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.hotel_contact}
                        />
                      </FormGroup>
                      {/* <FormGroup>
                        <label htmlFor="#customer">Select Customer</label>
                          <FormSelect id="#customer" onChange={customer.onChange} required>
                            <option value = ''>---Select Customer---</option>
                              {customers.map(customer => 
                              <option key={customer.id } value={customer.id}>   
                                { customer.name}
                              </option>
                            )}
                          </FormSelect>
                    </FormGroup>  */}
                    <FormGroup>
                        <label htmlFor="#hotel_room_type">Room Type</label>
                        <FormInput 
                          id="#hotel_room_type"
                          placeholder="Room Type*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.hotel_room_type}
                        />
                    </FormGroup>
                      <FormGroup>
                        <label htmlFor="#start_date">Start Date</label>
                        <FormInput 
                          type= "date"
                          id="#start_date"
                          placeholder="start date" 
                          autoComplete="off"
                          required
                          defaultValue = {data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : null}
                        />
                      </FormGroup>
                      {/* <FormGroup>
                        <label htmlFor="#current_year_lodgings">Free nights to be redeemed</label>
                        <FormInput 
                          type= "number"
                          id="#current_year_lodgings"
                          placeholder="Lodgings" 
                          autoComplete="off"
                          defaultValue = {data.current_year_lodgings}
                        />
                      </FormGroup>                */}
                    </div>
                    <div className="col-sm-12 col-md-6">
                    <FormGroup>
                        <label htmlFor="#hotel_address ">Hotel Address</label>
                        <FormInput 
                          id="#hotel_address"
                          placeholder="Hotel Address*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.hotel_address}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#guests">Guests (Adults)</label>
                        <FormInput 
                          type= "number"
                          id="#guests_number"
                          placeholder="Guests*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.guests_number}
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <label htmlFor="#voucher_to ">Voucher For</label>
                        <FormInput 
                          id="#voucher_to"
                          placeholder="Name*" 
                          autoComplete="off"
                          required
                          defaultValue = {data.voucher_to}
                        />
                    </FormGroup>
                    <FormGroup>
                    <label htmlFor="#end_date">End Date</label>
                    <FormInput 
                        type= "date"
                        id="#end_date"
                        placeholder="end date" 
                        autoComplete="off"
                        required
                        defaultValue =  {data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : null}
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

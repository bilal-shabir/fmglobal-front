import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput, FormSelect } from "shards-react";
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";
import { POST } from "../../API calls/POST";

export default ({customers, refetch, rtl}) => {
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const hotel_address = useInputValue(null)
    const hotel_contact = useInputValue(null)
    const hotelname = useInputValue(null)
    const hotel_room_type = useInputValue(null)
    const voucher_to = useInputValue(null)
    const guests_number = useInputValue(null)
    const start_date = useInputValue(null)
    const end_date = useInputValue(null)
    const current_year_lodgings = useInputValue(null)
    const customer = useInputValue(null)
    const show_add_modal = () => {
        setShow(true)
    }
    const close_add_modal =()=>{
        setShow(false)
    }
    async function handleSubmit(event) {
      event.preventDefault(); 
      const body ={
        payment_date: hotelname.value,
        amount: hotel_address.value,
        type: hotel_contact.value,
        hotel_room_type: hotel_room_type.value,
        voucher_to: voucher_to.value,
        guests_number: +guests_number.value,
        start_date: start_date.value,
        end_date : end_date.value,
        current_year_lodgings: +current_year_lodgings.value,
        customer: +customer.value
      }
      await POST(URL2+"reservation", body ,"Error: Failed to create reservation","Reservation created successfully")
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
                <i className="large material-icons">add</i>{t('add_payment_button')}
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
                    <span style={{color:'black'}}>{t('add_payment_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit }>
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
                          onChange={hotelname.onChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#hotel_contact ">Hotel Contact</label>
                        <FormInput 
                          id="#hotel_contact"
                          placeholder="Contact*" 
                          autoComplete="off"
                          required
                          onChange={hotel_contact.onChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#customer">Select Customer</label>
                          <FormSelect id="#customer" onChange={customer.onChange} required>
                            <option value = ''>---Select Customer---</option>
                              {customers.map(customer => 
                              <option key={customer.id } value={customer.id}>   
                                { customer.name}
                              </option>
                            )}
                          </FormSelect>
                    </FormGroup> 
                      <FormGroup>
                        <label htmlFor="#start_date">Start Date</label>
                        <FormInput 
                          type= "date"
                          id="#start_date"
                          placeholder="start date" 
                          autoComplete="off"
                          required
                          onChange={start_date.onChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#current_year_lodgings">Free nights to be redeemed</label>
                        <FormInput 
                          type= "number"
                          id="#current_year_lodgings"
                          placeholder="Lodgings" 
                          autoComplete="off"
                          onChange={current_year_lodgings.onChange}
                        />
                      </FormGroup>               
                    </div>
                    <div className="col-sm-12 col-md-6">
                    <FormGroup>
                        <label htmlFor="#hotel_contact ">Hotel Address</label>
                        <FormInput 
                          id="#hotel_contact"
                          placeholder="Hotel Address*" 
                          autoComplete="off"
                          required
                          onChange={hotel_address.onChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#hotel_room_type">Room Type</label>
                        <FormInput 
                          id="#hotel_room_type"
                          placeholder="Room Type*" 
                          autoComplete="off"
                          required
                          onChange={hotel_room_type.onChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#voucher_to ">Voucher For</label>
                        <FormInput 
                          id="#voucher_to"
                          placeholder="Name*" 
                          autoComplete="off"
                          required
                          onChange={voucher_to.onChange}
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
                        onChange={end_date.onChange}
                    />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#guests ">Guests (Adults)</label>
                        <FormInput 
                          type= "number"
                          id="#guests"
                          placeholder="Guests*" 
                          autoComplete="off"
                          required
                          onChange={guests_number.onChange}
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


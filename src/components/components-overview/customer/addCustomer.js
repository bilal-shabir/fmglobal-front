import React, { useState } from "react";
import {
  Modal, Table,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormGroup, FormInput, FormSelect } from "shards-react";
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";
import { POST } from "../../API calls/POST";

export default ({memberships,refetch}) => {
    const [membership,setMembership] = useState()
    const name = useInputValue("")
    const email = useInputValue("")
    const nationality = useInputValue("")
    const password = useInputValue("")
    const mobile = useInputValue("")
    const CPR = useInputValue("")
    const installment_date = useInputValue("")
    const installment_amount = useInputValue("")
    const downpaymentpaid = useInputValue("")
    const downpayment1date = useInputValue(null)
    const downpayment1amount = useInputValue("")
    const downpayment2date = useInputValue(null)
    const downpayment2amount = useInputValue("")
    const downpayment3date = useInputValue(null)
    const downpayment3amount = useInputValue("")
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const show_add_modal =  () => { 
        setShow(true)
    }
    const close_add_modal =()=>{
        setShow(false)
    }
    const membershipChange = (event) => {
      setMembership(JSON.parse(event.target.value))
    }
    async function handleSubmit(event) {
      event.preventDefault();
      if((+downpayment1amount.value) + (+downpayment2amount.value) + (+downpayment3amount.value) + (+downpaymentpaid.value) > (+membership.cost) ){
        toast.info("Down Payment should be less than or equal to the cost of the membership", {
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
      let array = []
      if(downpayment1date.value){
        array.push({payment_date: downpayment1date.value, amount: +downpayment1amount.value})
      }
      if(downpayment2date.value){
        array.push({payment_date: downpayment2date.value, amount: +downpayment2amount.value})
      }
      if(downpayment3date.value){
        array.push({payment_date: downpayment3date.value, amount:+ downpayment3amount.value})
      }
      const body ={
        name: name.value,
        email: email.value,
        password: password.value,
        nationality: nationality.value,
        CPR: CPR.value,
        mobile: mobile.value,
        membership: membership.id,
        downpayment_paid: +downpaymentpaid.value,
        downpayments: array,
        installments_amount: +installment_amount.value,
        installment_date: installment_date.value
      }
      // console.log(body)
      const insert = await POST(URL2+"customer",body, "Error: Failed to add customer", "Customer added successfully")
      refetch({})
      insert && close_add_modal()
    }
    return (
        <div>
            <button 
                onClick={show_add_modal} 
                className="btn btn-dark"  
                type="button" 
                style={{ color:'#D79D12'}}
            >
                <i className="large material-icons">add</i>{t('add_customer_button')}
            </button>
            <Modal
                show={show}
                onHide={close_add_modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                // scrollable ={true}
                style={{ marginLeft: "6%" }}
                
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span style={{color:'black'}}>{t('add_customer_heading')}</span>
                </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
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
                      <FormGroup>
                        <label htmlFor="#membership">Select Membership</label>
                          <FormSelect id="#membership" onChange={membershipChange} required>
                            <option value = ''>---Select Membership---</option>
                              {memberships.map(membership => 
                              <option key={membership.id } value={JSON.stringify(membership)}>   
                                { membership.name}
                              </option>
                            )}
                          </FormSelect>
                      </FormGroup> 
                      <FormGroup>
                        <label htmlFor="#installment_date">Installment Date</label>
                        <FormInput 
                          type= "date"
                          id="#installment_date"
                          placeholder="amount*" 
                          autoComplete="downpaymentpaid"
                          onChange= {installment_date.onChange}
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
                          placeholder="Password*" 
                          autoComplete="new-password"
                          onChange= {password.onChange}
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
                          onChange= {CPR.onChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#downpaymentpaid">Down Payment Paid</label>
                        <FormInput 
                          type= "number"
                          id="#downpaymentpaid"
                          placeholder="amount*" 
                          autoComplete="downpaymentpaid"
                          onChange= {downpaymentpaid.onChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <label htmlFor="#installment_amount">Installment amount</label>
                        <FormInput 
                          type= "number"
                          id="#installment_amount"
                          placeholder="amount*" 
                          autoComplete="downpaymentpaid"
                          onChange= {installment_amount.onChange}
                          required
                        />
                      </FormGroup>
                      
                      </div>
                    </div>
                  </div>
                  {/* {
                    downpayments.map(item => 
                      <div className="row">
                    <div className="col-sm-12 col-md-12">
                     
                    </div>
                  </div>
                  )
                  } */}
                  <Table bordered style={{marginTop:'10px'}}>
                    <thead>
                      <tr>
                        <th style={{ fontWeight: "600", width: "230px" }}>
                          Down Payments 
                          {/* <button type="button" onClick={() => {
                            if(downpayments.length > 0){
                            setDownpayments(downpayments.pop())
                            }
                          }}>-</button>
                          <input disabled style={{width:'25px', textAlign:'center'}} value={downpayments.length}  />
                            
                          <button type="button" onClick={() => {
                              const array = downpayments
                              array.push({id: downpayments.length + 1})
                              setDownpayments(array)
                            
                          }}>+</button> */}
                        </th>
                        <th style={{ fontWeight: "600" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <td>First Down Payment</td>
                          <td>
                          <FormGroup>
                              <div className="row">
                                <div className="col-sm-6 col-md-6">
                                <label htmlFor={`downpayment1date`}>Date</label>
                                  <FormInput 
                                    type= "date"
                                    id={`downpayment1date`}
                                    placeholder="Select Date" 
                                    autoComplete="downpayment1date"
                                    onChange= {downpayment1date.onChange}
                                    // required
                                  />
                                </div>
                                <div className="col-sm-6 col-md-6">
                                <label htmlFor={`downpayment1amount`}>Amount</label>
                                  <FormInput 
                                    type= "number"
                                    placeholder="amount" 
                                    id={`downpayment1amount`}
                                    autoComplete="downpayment1date"
                                    onChange= {downpayment1amount.onChange}
                                    required = {downpayment1date.value ? true : false }
                                  />
                                </div>
                              </div>
                            </FormGroup>
                          </td>
                        </tr>
                        <tr>
                          <td>Second Down Payment</td>
                          <td>
                          <FormGroup>
                              <div className="row">
                                <div className="col-sm-6 col-md-6">
                                <label htmlFor={`downpayment2date`}>Date</label>
                                  <FormInput 
                                    type= "date"
                                    id={`downpayment2date`}
                                    placeholder="Select Date" 
                                    autoComplete="downpayment1date"
                                    onChange= {downpayment2date.onChange}
                                    // required
                                  />
                                </div>
                                <div className="col-sm-6 col-md-6">
                                <label htmlFor={`downpayment2amount`}>Amount</label>
                                  <FormInput 
                                    type= "number"
                                    placeholder="amount" 
                                    id={`downpayment2amount`}
                                    autoComplete="downpayment1date"
                                    onChange= {downpayment2amount.onChange}
                                    required = {downpayment2date.value ? true : false }
                                  />
                                </div>
                              </div>
                            </FormGroup>
                          </td>
                        </tr>
                        <tr>
                          <td>Third Down Payment</td>
                          <td>
                          <FormGroup>
                              <div className="row">
                                <div className="col-sm-6 col-md-6">
                                <label htmlFor={`downpayment3date`}>Date</label>
                                  <FormInput 
                                    type= "date"
                                    id={`downpayment3date`}
                                    placeholder="Select Date" 
                                    autoComplete="downpayment1date"
                                    onChange= {downpayment3date.onChange}
                                    // required
                                  />
                                </div>
                                <div className="col-sm-6 col-md-6">
                                <label htmlFor={`downpayment3amount`}>Amount</label>
                                  <FormInput 
                                    type= "number"
                                    placeholder="amount" 
                                    id={`downpayment3amount`}
                                    autoComplete="downpayment1date"
                                    onChange= {downpayment3amount.onChange}
                                    required = {downpayment3date.value ? true : false }
                                  />
                                </div>
                              </div>
                            </FormGroup>
                          </td>
                        </tr>
                    </tbody>
                  </Table>
                  
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


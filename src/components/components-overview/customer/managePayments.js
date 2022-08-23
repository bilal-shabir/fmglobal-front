import React, { useEffect, useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { FormGroup, FormInput, FormSelect } from "shards-react";
import moment from "moment";
import { URL2 } from "../../../constants";
import { PUT } from "../../API calls/PUT";
import { GET } from "../../API calls/GET";



export default ({data, refetch}) => {
    const [edit, setEdit] = useState(false);
    const [payments, setPayments] = useState([]);
    const [paymentselected, setPaymentselected] = useState();
    const {t} = useTranslation()
    const show_edit_modal = () => {
        if(data.contracts.length === 0 || payments.length === 0){
          toast.info("Customer does not have any pending payments", {
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
        setEdit(true)
    }
    const close_edit_modal =()=>{
        setEdit(false)
    }
    useEffect(() => {
      async function fetchPayments() {
        const id = data.contracts ? data.contracts.length > 0 ? data.contracts[0].id : null : null
        if(id){
          let response = await GET(URL2+'payment/getCustomerPayments/'+id)
          if(response){
            setPayments(response)
          }
        }

      }
      fetchPayments()
    }, []);
    const onPaymentChange = async(event)=>{
      const value = JSON.parse(event.target.value)
      setPaymentselected(value)
    }
    const handleEdit = async() =>{
      if(paymentselected.amount < document.getElementById('#payment').value){
        toast.error("The entered amount should be less than or equal to the payment amount", {
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
        id: paymentselected.id,
        payment: document.getElementById('#payment').value,
        contract: data.contracts[0].id
      }

      const edit = await PUT(URL2+'payment/payInstallment', body, "Error: Failed to make paymnet", "Payment made successfully" )
      
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
                <i className="large material-icons">payment</i>{t('manage_customer_payment_button')}
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
                <span style={{color:'black'}}>{t('manage_customer_payment_heading')}</span>
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
                        <label htmlFor="#selectpayment">Select Payment</label>
                          <FormSelect id="#selectpayment" required onChange={onPaymentChange}>
                            <option value = ''>---Select Payment Date---</option>
                              {payments.map(payment => 
                              <option key={payment.id } value={JSON.stringify(payment)}>   
                                { moment(payment.payment_date).format('DD-MM-YYYY')} / amount : {payment.amount} BHD
                              </option>
                            )}
                          </FormSelect>
                          {/* <label htmlFor="#payment">Amount to be paid: {tobepaid}</label> */}
                      </FormGroup> 
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div>
                      <FormGroup>
                        <label htmlFor="#payment">Payment</label>
                        <FormInput 
                          type= "number"
                          id="#payment"
                          placeholder="payment*" 
                          autoComplete="off"
                          // defaultValue={data.amount}
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


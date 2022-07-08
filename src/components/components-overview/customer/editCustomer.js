import React, { useState } from "react";
import {
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { URL2 } from "../../../constants";
import { useInputValue } from "../../../hooks/useInputValue";


export default ({data, refetch}) => {
    const name = useInputValue(data.name)
    const email = useInputValue(data.email)
    const mobile = useInputValue(data.mobile)
    const nationality = useInputValue(data.nationality)
    const CPR = useInputValue(data.CPR)
    // const is_deleted = useInputValue(data.is_deleted)

    const [edit, setEdit] = useState(false);
    const {t} = useTranslation()
    const show_edit_modal = () => {
        setEdit(true)
    }
    const close_edit_modal =()=>{
        setEdit(false)
    }
    const handleEdit = async() =>{
      refetch({})
      close_edit_modal()
      const body ={
        id: data.id,
        name: name.value,
        email: email.value,
        mobile: mobile.value,
        nationality: nationality.value,
        CPR: CPR.value
      }
      const options = {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        method: "PUT",
        mode: "cors",
        body: JSON.stringify(body)
      }
      await fetch(URL2+"customer", options)
      .then((res) =>  {
        if(!res.ok){
          throw Error(res.statusText)
        }
        return res.json()
      })
      .then((res) => {
        refetch({})
        toast.success('Customer Details Updated', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
      })
      .catch((err) => {
        toast.error('Error: Failed to Update Details', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
      });
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
                <Modal.Body>
                <ul className="list-group list-group-flush">
                <li className="list-group-item p-3">
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <form>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Full Name*"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              defaultValue={data.name}
                              onChange={name.onChange}
                            />{" "}
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="basic-addon1">
                                @
                              </span>
                            </div>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email*"
                              aria-label="email"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                              defaultValue={data.email}
                              onChange= {email.onChange}
                            />{" "}
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Mobile Number"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              defaultValue={data.mobile}
                              onChange= {mobile.onChange}
                            />{" "}
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="input-group mb-3">
                            <select className="form-control ">
                              <option>Role</option>
                              <option>...</option>
                            </select>
                          </div>
                        </div>
                        
                      </form>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <form>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nationality"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                              defaultValue={data.nationality}
                              onChange= {nationality.onChange}
                            />{" "}
                          </div>
                        </div>
                        {/* <div className="form-group">
                          <input
                            type="password"
                            className="form-control"
                            id="inputPassword4"
                            placeholder="Password*"
                            autoComplete="off"
                          />{" "}
                        </div> */}
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="CPR"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              defaultValue={data.CPR}
                              onChange= {CPR.onChange}
                            />{" "}
                          </div>
                        </div>
                        
                      </form>
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


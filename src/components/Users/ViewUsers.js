import React from "react";
import AddUserModal from "../../components/Users/AddUserModal";
import {Button } from "react-bootstrap";
class ViewUsers extends React.Component {
  constructor(props) {
    super(props);
  }

 

  render() {
    return (
        <div class="main-content-container container-fluid px-4">
       
        {/* <div class="page-header row no-gutters py-4">
          <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
            <span class="text-uppercase page-subtitle">Overview</span>
            <h3 class="page-title">Data Tables</h3>
          </div>
        </div> */}
        
            <div class="card card-small mb-4">
              <div  style={{display:'flex'}} class="  card-header border-bottom">
                <h6 style={{flex:'8'}} class="m-0 ">Active Users</h6>
                <span><AddUserModal/></span>
              </div>
              
              <div class="card-body p-0 pb-3 text-center">
                <table class="table mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th scope="col" class="border-0">#</th>
                      <th scope="col" class="border-0">First Name</th>
                      <th scope="col" class="border-0">Last Name</th>
                      <th scope="col" class="border-0">Country</th>
                      <th scope="col" class="border-0">City</th>
                      <th scope="col" class="border-0">Phone</th>
                      <th scope="col" class="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Ali</td>
                      <td>Kerry</td>
                      <td>Russian Federation</td>
                      <td>Gdańsk</td>
                      <td>107-0339</td>
                      <td>
                          <button type="button" class="btn btn-primary mr-1">Edit</button>
                          <button type="button" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>

    );
  }
}

export default ViewUsers;

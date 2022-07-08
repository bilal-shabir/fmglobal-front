import React from "react";
import {
  Form,
  InputGroup,
} from "shards-react";

export default () => (
  <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex" style={{marginRight:'-2px',backgroundImage:'linear-gradient(to right, #FFFFFF, #FFFFFF)', zIndex: '1'}}>
    <InputGroup seamless className="ml-3">
      {/* <InputGroupAddon type="prepend">
        <InputGroupText>
          <i className="material-icons">search</i>
        </InputGroupText>
      </InputGroupAddon>
      <FormInput
        className="navbar-search"
        placeholder="Search for something..."
      /> */}
    </InputGroup>
  </Form>
  
);

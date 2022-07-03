import React from "react";
import { Card, CardBody, Form, FormInput ,FormSelect, FormRadio  } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

const Editor = () => (
  <Card small className="mb-3">
    <CardBody>
      <Form className="add-new-post">
      
        <FormInput  type="date"/>

        <FormSelect>
      <option value="Salman City">Salman City</option>
      <option value="Aldur">Aldur</option>


    </FormSelect>
        <FormSelect>
      <option value="pH">Task1</option>
      <option value="TDS">Task2</option>
      <option value="TSS">Task3</option>
      <option value="Silica">Task4</option>
      <option value="Salinity">Task5</option>
      
    </FormSelect>

    
       
      </Form>
    </CardBody>
  </Card>
);



export default Editor;

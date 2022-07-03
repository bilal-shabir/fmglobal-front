import React from "react";
import ReactQuill from "react-quill";
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
      <option value="pH">pH</option>
      <option value="TDS">TDS</option>
      <option value="TSS">TSS</option>
      <option value="Silica">Silica</option>
      <option value="Salinity">Salinity</option>

    </FormSelect>

    <FormInput  placeholder="Value" className="mb-2" />
       
    <ReactQuill className="add-new-post__editor mb-1"  placeholder="comment"/>

      </Form>
    </CardBody>
  </Card>
);



export default Editor;

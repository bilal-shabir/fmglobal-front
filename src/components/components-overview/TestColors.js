import React from "react";
import { Row, Col } from "shards-react";




const Colors = () => (
  <Row  className="mb-2">
    <Col   lg="12">
      <span style={{ fontSize: "16px" }} className="d-block mb-2 text-muted">
        {/* <strong>Colors Indicator</strong> */}
      </span>
    </Col>

    <Col className="mb-4">
      <div
        className="bg-success text-Black text-center rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
        Stable Over 8 Readings
      </div>
    </Col>

    <Col className="mb-4">
      <div
        className=" text-Black text-center rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)", backgroundColor:"rgba(254,235,190)" }}>
        Improving Over 4 Readings
      </div>
    </Col>

    
    <Col className="mb-4">
      <div
        className=" text-Black text-center rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)", backgroundColor:"rgba(255, 187, 138)" }}>
        Getting Worse Over 4 Readings
      </div>
    </Col>

    <Col className="mb-4">
      <div
        className="bg-danger text-Black text-center rounded p-3"
        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
        Outside Limits Over 4 Readings
      </div>
    </Col>
  </Row>
);
export default Colors;

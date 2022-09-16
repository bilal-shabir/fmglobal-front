import React from "react";
import { Col, Row } from "shards-react";

const AnalyticsCards = () =>{
    return(
        <Row style={{height:'80px'}}>
            <Col sm="12" md="" >
                <div className="d-flex" style={{borderRadius: '10px', backgroundColor:'#D79D12', boxShadow:'0px 1px 13px -6px rgba(23,23,23,0.75)'}}>
                    <div className="d-flex justify-content-center align-items-center iconcontainer">
                        <i class="material-icons" style={{fontSize:'50px', color:'#D79D12', backgroundColor:'black', borderRadius:'15px', padding:'5px'}} >equalizer</i>
                    </div>
                    <div className="d-flex justify-content-center align-items-center ml-1">
                        <h3 style={{lineHeight:0.7, fontWeight:700, color:'black'}}>3<br/> <span style={{ fontSize:'16px', fontWeight:600, color:'black'}}>Total Sales</span></h3>
                    </div>
                </div>
            </Col>
            <Col sm="12" md="" >
                <div className="d-flex " style={{borderRadius: '10px',  backgroundColor:'#D79D12', boxShadow:'0px 1px 13px -6px rgba(23,23,23,0.75)'}}>
                    <div className="d-flex justify-content-center align-items-center iconcontainer">
                        <i class="material-icons" style={{fontSize:'50px', color:'#D79D12', backgroundColor:'black', borderRadius:'15px', padding:'5px'}} >show_chart</i>
                    </div>
                    <div className="d-flex justify-content-center align-items-center ml-1">
                        <h3 style={{ lineHeight:0.7, fontWeight:700, color:'black'}}>1<br/> <span style={{ fontSize:'16px', fontWeight:600, color:'black'}}>Monthly Sales</span></h3>
                    </div>
                </div>
            </Col>
            <Col sm="12" md="" >
                <div className="d-flex " style={{borderRadius: '10px',  backgroundColor:'#D79D12', boxShadow:'0px 1px 13px -6px rgba(23,23,23,0.75)'}}>
                    <div className="d-flex justify-content-center align-items-center iconcontainer">
                        <i class="material-icons" style={{fontSize:'50px', color:'#D79D12', backgroundColor:'black', borderRadius:'15px', padding:'5px'}} >attach_money</i>
                    </div>
                    <div className="d-flex justify-content-center align-items-center ml-1">
                        <h3 style={{ lineHeight:0.7, fontWeight:700, color:'black'}}>0<br/> <span style={{ fontSize:'16px', fontWeight:600, color:'black'}}>Paid Payments</span></h3>
                    </div>
                </div>
            </Col>
            <Col sm="12" md="" >
                <div className="d-flex " style={{borderRadius: '10px',  backgroundColor:'#D79D12', boxShadow:'0px 1px 13px -6px rgba(23,23,23,0.75)'}}>
                    <div className="d-flex justify-content-center align-items-center iconcontainer">
                        <i class="material-icons" style={{fontSize:'50px', color:'#D79D12', backgroundColor:'black', borderRadius:'15px', padding:'5px'}} >money_off</i>
                    </div>
                    <div className="d-flex justify-content-center align-items-center ml-1">
                        <h3 style={{ lineHeight:0.7, fontWeight:700, color:'black'}}>0<br/> <span style={{ fontSize:'16px', fontWeight:600, color:'black'}}>Unpaid Payments</span></h3>
                    </div>
                </div>
            </Col>
            <Col sm="12" md="" >
                <div className="d-flex " style={{borderRadius: '10px',  backgroundColor:'#D79D12', boxShadow:'0px 1px 13px -6px rgba(23,23,23,0.75)'}}>
                    <div className="d-flex justify-content-center align-items-center iconcontainer">
                        <i class="material-icons" style={{fontSize:'50px', color:'#D79D12', backgroundColor:'black', borderRadius:'15px', padding:'5px'}} >timelapse</i>
                    </div>
                    <div className="d-flex justify-content-center align-items-center ml-1">
                        <h3 style={{ lineHeight:0.7, fontWeight:700, color:'black'}}>2<br/> <span style={{ fontSize:'16px', fontWeight:600, color:'black'}}>Current Month Payments</span></h3>
                    </div>
                </div>
            </Col>
            
        </Row>
    )
}
export default AnalyticsCards
import React from "react";
import { Container, Row, Col } from "shards-react";
import Cookies from "universal-cookie";


function  Plain  ({children}){
  const cookies = new Cookies();
  const currentLanguageCode = cookies.get('i18next') || 'en'
  document.body.dir = currentLanguageCode === 'ar' ? 'rtl' : 'ltr'
 
  return(
<Container>
  <Row>
  <Col md="12">
  {children}
  </Col>
  </Row>
</Container>
  )
        
     
};

export default Plain;

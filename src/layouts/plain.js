import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import banner from '../images/loginbanner.JPG'
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

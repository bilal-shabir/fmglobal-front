import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import '../assets/style.css'
import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
function DefaultLayout  ({ children, noNavbar, noFooter })  {

  return(
  <Container fluid>
    <Row>
      <MainSidebar />
        <>
        <Col>
        </Col>
        <Col
		id = 'main-content'
        className="main-content p-0"
        lg={{ size: 10 }}
        md={{ size: 9}}
        sm="12"
        tag="main"
      >
        {!noNavbar && <MainNavbar />}
        {children}
        {!noFooter && <MainFooter />}
      </Col>
      </>
      
    </Row>
  </Container>
)};

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default DefaultLayout;

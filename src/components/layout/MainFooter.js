import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Nav } from "shards-react";

const MainFooter = ({ contained, menuItems, copyright }) => (
  <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
    <Container fluid={contained}>
      <Row>
        <Nav>
        </Nav>
        <span className="copyright ml-auto my-auto mr-2">{copyright}</span>
      </Row>
    </Container>
  </footer>
);

MainFooter.propTypes = {
  /**
   * Whether the content is contained, or not.
   */
  contained: PropTypes.bool,
  /**
   * The menu items array.
   */
  menuItems: PropTypes.array,
  /**
   * The copyright info.
   */
  //copyright: PropTypes.string
};

MainFooter.defaultProps = {
  contained: false,
  copyright: "Copyright © 2022",
  menuItems: [
    {
      title: "Home",
      to: "#"
    },
    {
      title: "Dashboard",
      to: "#"
    },
    {
      title: "About Us",
      to: "#"
    },
    {
      title: "Contact Us",
      to: "#"
    },

 
  ]
};

export default MainFooter;

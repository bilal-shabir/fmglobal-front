import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import { NavItem, NavLink as Link } from "shards-react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const currentLanguageCode = cookies.get('i18next') || 'en'

const SidebarNavItem = ({ item }) => (
  <NavItem  style={{textAlign: currentLanguageCode === 'ar' ? 'right' : 'left'}}>
    <Link tag={(props) => <RouteNavLink {...props} />} to={item.to}>
      {item.htmlBefore && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
         
        />
      )}
      {item.title && <span style={{marginRight:'5px'}}>{currentLanguageCode === 'en' ? item.title : item.title_ar}</span>}
      {item.htmlAfter && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
        />
      )}
    </Link>
  </NavItem>
);

SidebarNavItem.propTypes = {
  /**
   * The item object.
   */
  item: PropTypes.object
};

export default SidebarNavItem;

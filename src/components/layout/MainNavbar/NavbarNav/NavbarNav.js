import React from "react";
import { Nav } from "shards-react";

//import Notifications from "./Notifications";
import UserActions from "./UserActions";
import Notifications from "./Notifications";

export default () => (
  <Nav navbar className="flex-row">
    <Notifications />
    <UserActions />
  </Nav>
);

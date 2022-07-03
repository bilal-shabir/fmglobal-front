// import React from "react";
// import { BrowserRouter as Router, Route,Switch} from "react-router-dom";

// import routes from "./routes";
// import withTracker from "./withTracker";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
// import RouteWithSubRoutes from './utils/RouteWithSubRoutes';

// export default () => (
//   <Router basename={process.env.REACT_APP_BASENAME || ""}>
//     <Switch>
//       <div>
//         {routes.map((route, index) => {
//           return (
//             <RouteWithSubRoutes key={index} {...route} />
//           );
//         })}
//       </div>
//     </Switch>
//   </Router>

// );

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

export default () => (
  <Router basename={process.env.REACT_APP_BASENAME || ""}>
    <div>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={withTracker(props => {
              return (
                <route.layout {...props}>
                <route.component {...props} />
                </route.layout>
               
              );
            })}
          />
        );
      })}
    </div>
  </Router>

);


import React from "react";
import { Route } from 'react-router-dom';
import withTracker from "./../withTracker";

const RouteWithSubRoutes = (route) => {
    return (

        <Route
        key={route.index}
        path={route.path}
        exact={route.exact}
        component={withTracker(props => {
          return (
            <route.layout {...props}>
              <route.component {...props} routes={route.r} />
            </route.layout>
          );
        })}
      />
    // <Route
    //     path={route.path}
    //     render={(props) => (
    //         <route.component {...props} routes={route.routes} />.
    //     )}
    // />
    );
};

export default RouteWithSubRoutes;
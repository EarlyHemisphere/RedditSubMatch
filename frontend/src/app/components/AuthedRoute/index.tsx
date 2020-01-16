import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { inject, observer } from "mobx-react";
import { AUTH_STORE } from "app/constants";
import { AuthStore } from "app/stores";

export interface AuthedRouteProps extends RouteProps {
}

export interface AuthedRouteState {
}

@inject(AUTH_STORE)
@observer
export class AuthedRoute extends React.Component<AuthedRouteProps, AuthedRouteState> {
  constructor(props: AuthedRouteProps, context: any) {
    super(props, context);
    this.state = {};
  }
  render() {
    const store = this.props[AUTH_STORE] as AuthStore
    if(store.loading){
      return <div>Loading</div>
    }else{
      if (store.isLoggedIn) {
        return (<Route {...this.props} />)
      } else {
        return (
          <Route
            render={rProps =>
              <Redirect
                to={`/login?redirect=${rProps.location.pathname}${
                  rProps.location.search
                  }`}
              />
            }
          />
        )
      }
    }

  }
}
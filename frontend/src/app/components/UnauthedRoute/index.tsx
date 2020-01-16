import * as React from "react";
import { Route, RouteProps } from "react-router";

export interface UnauthedRouteProps extends RouteProps{
}

export interface UnauthedRouteState {

}

export class UnauthedRoute extends React.Component<UnauthedRouteProps, UnauthedRouteState> {
    constructor(props: UnauthedRouteProps, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Route {...this.props}  />
        );
    }
}
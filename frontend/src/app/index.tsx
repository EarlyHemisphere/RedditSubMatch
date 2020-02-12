import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Router, Switch, Route } from 'react-router';
import Home from 'app/containers/Home';
import Success from './containers/Success';

export const App = hot(({ history }: any) => (
  <Router history={history}>
    <Switch>
      <Route path="/success" component={Success} />
      <Route component={Home} />
    </Switch>
  </Router>
));
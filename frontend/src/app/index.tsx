import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Router, Switch, Route } from 'react-router';
import Home from 'app/containers/Home';
import {Redirect} from './containers/Redirect';
import {Blacklist} from './containers/Blacklist';

export const App = hot(({ history }: any) => (
  <Router history={history}>
    <Switch>
      <Route path="/redirect" component={Redirect} />
      <Route path="/blacklist" component={Blacklist} />
      <Route component={Home} />
    </Switch>
  </Router>
));
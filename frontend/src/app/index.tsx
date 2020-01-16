import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Router, Switch, Route } from 'react-router';
import { Root } from 'app/containers/Root';
import { Home } from 'app/containers/Home';
import { UnauthedRoute } from './components/UnauthedRoute';
import { AuthedRoute } from './components/AuthedRoute';
import { Login } from './containers/Login';
import { Admin } from './containers/Admin';
import { ErrorComponent } from './containers/Error';


export const App = hot(({history}: any) => (
    <Root>
      <Router history={history}>

        <Switch>
          
          <UnauthedRoute path="/login" exact component={Login}></UnauthedRoute>
          <AuthedRoute path="/admin" exact component={Admin} />
          <AuthedRoute path="/error" exact component={ErrorComponent} />
          <Route path="/:path" component={Home} />
          {/* <Route path="/" component={Home} /> */}

        </Switch>
      </Router>
    </Root>
));
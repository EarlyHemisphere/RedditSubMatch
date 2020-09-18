import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Router, Switch, Route } from 'react-router';
import Home from 'app/containers/Home';
import {Redirect} from './containers/Redirect';
import {Blacklist} from './containers/Blacklist';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { SubredditFiltering } from 'app/containers/SubredditFiltering';

export const App = hot(({ history }: any) => {
  // Used to prevent the height of the page from being too big when viewing with Chrome on iOS
  window.addEventListener('resize', () => {
    document.documentElement.style.height = `${window.innerHeight.toString()}px`;
    document.body.style.height = `${window.innerHeight.toString()}px`;
    document.getElementById('root')!.style.height = `${window.innerHeight.toString()}px`;
  });

  window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.height = `${window.innerHeight.toString()}px`;
    document.body.style.height = `${window.innerHeight.toString()}px`;
    document.getElementById('root')!.style.height = `${window.innerHeight.toString()}px`;
  });

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#ff8100',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Switch>
          <Route path="/redirect" component={Redirect} />
          <Route path="/blacklist" component={Blacklist} />
          <Route path="/exclude" component={SubredditFiltering} />
          <Route component={Home} />
        </Switch>
      </Router>
    </ThemeProvider>
  )
});
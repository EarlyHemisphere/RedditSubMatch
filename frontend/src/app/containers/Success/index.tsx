import * as React from 'react';
import * as style from './style.scss';
import * as qs from 'query-string'
import { firebaseFunctions } from 'app/firebase/base';
import { Container, Grid, Typography } from '@material-ui/core';
import Optout from './Optout';
import Optin from './Optin';

export default function Success(props) {
  const data = { code: qs.parse(props.location.search).code }
  const optOut = localStorage.getItem('optOut') == 'true'
  if (optOut) {
    const deleteUserInfo = firebaseFunctions.httpsCallable("deleteUserInfo")
    deleteUserInfo(data);
    return <Optout/>
  } else {
    const submitUserLogin = firebaseFunctions.httpsCallable("submitUserLogin")
    submitUserLogin(data);
    return <Optin/>
  }
}
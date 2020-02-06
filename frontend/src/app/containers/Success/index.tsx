import * as React from 'react';
import * as style from './style.scss';
import * as qs from 'query-string'
import { firebaseFunctions } from 'app/firebase/base';
import { Container, Grid, Typography } from '@material-ui/core';

export default function success(props) {
  const data = { code: qs.parse(props.location.search) }
  const optOut = localStorage.getItem('optOut') == 'true'

  if (optOut) {
    const deleteUserLogin = firebaseFunctions.httpsCallable("deleteUserLogin")
    deleteUserLogin(data);
  } else {
    const submitUserLogin = firebaseFunctions.httpsCallable("submitUserLogin")
    submitUserLogin(data);
  }
  
  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{ minHeight: '100vh' }}>
        <Typography variant="h3" display="block" classes={{ root: style.title }}>submatch</Typography>
        { optOut ? (
          <>
            <Typography variant="h4" display="block" gutterBottom classes={{ root: style.text }}>
              You have been <b style={{ color: '#29a329' }}>removed</b> from matching
            </Typography>
            <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>and your data has been deleted.</Typography>
          </>
        ) : (
          <Typography variant="h4" display="block" gutterBottom classes={{ root: style.text }}>success</Typography>
        )}
      </Grid>
    </Container>
  );
}
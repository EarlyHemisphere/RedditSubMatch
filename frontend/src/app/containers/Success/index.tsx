import * as React from 'react';
import * as style from './style.scss';
import * as qs from 'query-string'
import { firebaseFunctions } from 'app/firebase/base';
import { Container, Grid, Typography } from '@material-ui/core';

export default function success(props) {
  const data = { code: qs.parse(props.location.search).code }
  const optOut = localStorage.getItem('optOut') == 'true'
  
  if (optOut) {
    const deleteUserInfo = firebaseFunctions.httpsCallable("deleteUserInfo")
    deleteUserInfo(data);
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
            <Typography variant="h5" display="block" classes={{ root: style.text }} style={{ marginBottom: '4rem' }}>and your data has been deleted.</Typography>
            <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>
              You can always <a href='https://wwww.reddit-submatch.web.app' style={{ color: 'yellow' }}>opt in</a>
            </Typography>
            <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>
              or visit <a href='https://www.reddit.com/r/submatch' style={{ color: '#FF4500' }}>the subreddit</a> for updates about matching and community events.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h2" display="block" classes={{ root: style.text }} style={{ color: '#29a329', marginBottom: '6rem' }}><b>Success!</b></Typography>
            <Typography variant="h4" display="block" classes={{ root: style.text }} style={{ marginBottom: '3rem' }}>You are now participating in regular matching!</Typography>
            <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>For more info or if you have any questions or concerns,</Typography>
            <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>
              head over to <a href='https://www.reddit.com/r/submatch' style={{ color: '#FF4500' }}>r/submatch</a>.</Typography>
          </>
        )}
      </Grid>
    </Container>
  );
}
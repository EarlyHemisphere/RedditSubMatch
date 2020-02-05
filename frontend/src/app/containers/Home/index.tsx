import * as React from 'react';
import * as style from './style.scss';
import { generateRandomString } from 'app/helpers';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import 'typeface-roboto';

interface Props{
}
interface State {
}

const CLIENT_ID = 'BRgd2M3wfJD7Vw'
const CODE = 'code'
const REDIRECT_URI = 'https://reddit-submatch.web.app/success'
const SIGNUP_DURATION = 'permanent'
const OPTOUT_DURATION = 'temporary'
const SIGNUP_SCOPE = 'mysubreddits%20identity'
const OPTOUT_SCOPE = 'identity'

const useStyles = makeStyles({
  root: {
    backgroundImage: 'linear-gradient(45deg, #FF8E53 20%, #FF4500 70%)',
    backgroundPosition: 'center center',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 60,
    width: 200,
    padding: '0 30',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    backgroundSize: '200% auto',
    transition: '0.5s',
    '&:hover': {
      backgroundPosition: 'left top',
    }
  },
  label: {
    fontSize: '25px',
  }
});

const getUrl = (optOut: Boolean = false) => {
  return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${optOut ? OPTOUT_DURATION : SIGNUP_DURATION}&scope=${optOut ? OPTOUT_SCOPE : SIGNUP_SCOPE}`
}

const setLocalStorage = (optOut: Boolean = false) => {
  localStorage.setItem('optOut', optOut.toString())
}

export default function home() {
  const styles = useStyles();

  return (
    <Container maxWidth={false} classes={{ root: style.home }}>
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        <Typography variant="h1" display="block" gutterBottom style={{ marginBottom: '10rem' }}>submatch</Typography>
        <Button classes={{ root: styles.root, label: styles.label }} size="large">
          <a href={getUrl()} onClick={((e) => setLocalStorage())}> sign up </a>
        </Button>
        <Typography variant="button" display="block" style={{ margin: '2rem 0' }}>or</Typography>
        <Button variant="outlined" size="large">
          <a id='deleteUserInfo' href={getUrl(true)} onClick={((e) => setLocalStorage(true))}> opt out </a>
        </Button>
      </Grid>
    </Container>
  );
}
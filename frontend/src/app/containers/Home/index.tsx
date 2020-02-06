import * as React from 'react';
import * as style from './style.scss';
import { generateRandomString } from 'app/helpers';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Typography } from '@material-ui/core';
import 'typeface-roboto';

const CLIENT_ID = 'BRgd2M3wfJD7Vw'
const CODE = 'code'
const REDIRECT_URI = 'http://localhost:3000/success'
const SIGNUP_DURATION = 'permanent'
const OPTOUT_DURATION = 'temporary'
const SIGNUP_SCOPE = 'mysubreddits%20identity'
const OPTOUT_SCOPE = 'identity'

const useStyles = makeStyles({
  root: {
    backgroundImage: 'linear-gradient(45deg, #FF4500 30%, #FF7530 65%)',
    backgroundPosition: 'center center',
    borderRadius: 15,
    border: 0,
    color: 'white',
    height: 80,
    width: 250,
    padding: '0 30',
    boxShadow: '0 5px 5px 2px rgba(0, 0, 0, .1)',
    backgroundSize: '200% auto',
    transition: '0.5s',
    '&:hover': {
      backgroundPosition: 'right top',
      boxShadow: '0 8px 12px 8px rgba(0, 0, 0, .1)',
    }
  },
  label: {
    fontSize: '24px',
  },
});

const getUrl = (optOut: Boolean = false) => {
  return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${optOut ? OPTOUT_DURATION : SIGNUP_DURATION}&scope=${optOut ? OPTOUT_SCOPE : SIGNUP_SCOPE}`
}

const setLocalStorage = (optOut: Boolean = false) => {
  localStorage.setItem('optOut', optOut.toString())
}

export default function home(props) {
  const styles = useStyles();

  return (
    <Container maxWidth={false} classes={{ root: style.home }}>
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        <Typography variant="h1" display="block" classes={{ root: style.title }}>submatch</Typography>
        <a href={getUrl()} onClick={((e) => setLocalStorage())}>
          <Button classes={{ root: styles.root, label: styles.label }} size="large">sign up</Button>
        </a>
        <Typography variant="button" display="block" style={{ margin: '2rem 0' }} classes={{ root: style.text }}>or</Typography>
        <a id='deleteUserInfo' href={getUrl(true)} onClick={((e) => setLocalStorage(true))}>
          <Button variant="outlined" size="large">opt out</Button>
        </a>
      </Grid>
    </Container>
  );
}
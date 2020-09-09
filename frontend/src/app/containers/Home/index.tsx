import * as React from 'react';
import * as style from './style.scss';
import { generateRandomString } from 'app/helpers';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Typography, Hidden, Link, IconButton, CircularProgress } from '@material-ui/core';
import 'typeface-roboto';
import { GitHub, Reddit } from '@material-ui/icons';
import { db } from 'app/firebase/base';
import Async from 'react-async';

const CLIENT_ID = 'BRgd2M3wfJD7Vw';
const CODE = 'code';
const REDIRECT_URI = 'https://redditsubmatch.com/redirect';
const SIGNUP_DURATION = 'permanent';
const OPTOUT_DURATION = 'temporary';
const SIGNUP_SCOPE = 'mysubreddits%20identity';
const OPTOUT_SCOPE = 'identity';

const useStyles = makeStyles((theme: Theme) => createStyles({
  signupBtn: {
    [theme.breakpoints.down('md')]: {
      height: 100,
      width: '100%',
      marginBottom: '2rem',
    },
    height: 80,
    width: 250,
    backgroundImage: 'linear-gradient(45deg, #FF4500 20%, #FFAA00 70%)',
    backgroundPosition: 'center center',
    borderRadius: 15,
    border: 0,
    color: 'white',
    boxShadow: '0 5px 5px 2px rgba(0, 0, 0, .1)',
    backgroundSize: '250% auto',
    transition: 'background-position 0.5s, box-shadow 0.5s',
    '&:hover': {
      backgroundPosition: 'right top',
      boxShadow: '0 8px 12px 8px rgba(0, 0, 0, .1)',
    }
  },
  label: {
    fontSize: '24px',
    color: 'white'
  },
  noSelect: {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
  },
  title: {
    marginBottom: '5vh',
    [theme.breakpoints.down('md')]: {
      marginTop: '15vh',
    }
  },
  parentGrid: {
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'inherit',
    }
  },
  outerGrid: {
    [theme.breakpoints.down('md')]: {
      width: '95%',
      position: 'absolute',
      bottom: 30,
    },
  },
  optOut: {
    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    width: 150,
    height: 60,
    [theme.breakpoints.down('md')]: {
      height: 100,
      width: '100%',
      fontSize: '24px',
      borderRadius: 15,
      border: '3px solid',
      marginBottom: 0,
    },
  },
  signupCount: {
    marginBottom: '18vh',
    fontSize: '24px',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      marginBottom: '30vh',
      fontSize: '40px',
    }
  },
  circularProgress: {
    marginLeft: '10px',
    marginRight: '20px',
    width: '17px !important',
    height: '17px !important',
    [theme.breakpoints.down('md')]: {
      marginLeft: '10px',
      marginRight: '38px',
      width: '30px !important',
      height: '30px !important',
    }
  }
}));

const getUrl = (optOut = false) => {
  return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${optOut ? OPTOUT_DURATION : SIGNUP_DURATION}&scope=${optOut ? OPTOUT_SCOPE : SIGNUP_SCOPE}`;
}

const setLocalStorage = (optOut = false) => {
  localStorage.setItem('isBrowser', 'true');
  localStorage.setItem('optOut', optOut.toString());
  window.sessionStorage.setItem('blacklist', 'false');
}

const getSignupCount = async () => {
  return await db.ref('signup_count').once('value');
}

export default function home() {
  const styles = useStyles();
  localStorage.setItem('isBrowser', 'false');

  return (
    <Container maxWidth={false} classes={{ root: style.home }}>
      <Grid container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ minHeight: '100vh' }}
        classes={{ root: styles.parentGrid }}>
        <Typography variant='h1' display='block' className={`${style.title} ${styles.noSelect} ${styles.title}`}>submatch</Typography>
        <Grid classes={{ root: styles.outerGrid }} container spacing={0} direction='column' alignItems='center' justify='center'>
          <Async promiseFn={getSignupCount}>
            <Async.Loading>
              <Typography display='block' variant='overline' className={`${styles.signupCount} ${styles.noSelect}`}>signup count: <CircularProgress classes={{ root: styles.circularProgress }}/></Typography>
            </Async.Loading>
            <Async.Rejected>
              { 
                () => {
                  return <Typography display='block' variant='overline' className={`${styles.signupCount} ${styles.noSelect}`}>signup count: could not fetch</Typography>
                }
              }
            </Async.Rejected>
            <Async.Fulfilled>
              {
                (snapshot:any) => {
                  return <Typography display='block' variant='overline' className={`${styles.signupCount} ${styles.noSelect}`}>signup count: <b>{snapshot.val()}</b></Typography>
                }
              }
            </Async.Fulfilled>
          </Async>
          <Button href={getUrl()} onClick={((e) => setLocalStorage())} classes={{ root: styles.signupBtn, label: styles.label }} size='large'>sign up</Button>
          <Hidden mdDown>
            <Typography variant='button' display='block' style={{ marginBottom: '2rem', marginTop: '6rem' }} classes={{ root: styles.noSelect }}>or, if you're already signed up</Typography>
          </Hidden>
          <Button href={getUrl(true)} onClick={((e) => setLocalStorage(true))} variant='outlined' size='large' classes={{ root: styles.optOut }}>unsubscribe</Button>
          <Hidden mdDown>
            <Grid classes={{ root: style.bottomButtons }} direction='row' alignItems='center' justify='center'>
              <Link href='https://github.com/LucasAnderson07/RedditSubMatch'>
                <IconButton>
                  <GitHub fontSize='large' />
                </IconButton>
              </Link>
              <Link href='https://www.reddit.com/r/submatch'>
                <IconButton>
                  <Reddit color='secondary' fontSize='large' />
                </IconButton>
              </Link>
            </Grid>
          </Hidden>
        </Grid>
      </Grid>
    </Container>
  );
}
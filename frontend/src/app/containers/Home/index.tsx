import * as React from 'react';
import * as style from './style.scss';
import { generateRandomString } from 'app/helpers';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Typography, Hidden, Link, IconButton } from '@material-ui/core';
import 'typeface-roboto';
import { GitHub, Reddit } from '@material-ui/icons';

const CLIENT_ID = 'BRgd2M3wfJD7Vw'
const CODE = 'code'
const REDIRECT_URI = 'https://redditsubmatch.com/redirect'
const SIGNUP_DURATION = 'permanent'
const OPTOUT_DURATION = 'temporary'
const SIGNUP_SCOPE = 'mysubreddits%20identity'
const OPTOUT_SCOPE = 'identity'

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
    marginBottom: '10rem',
    [theme.breakpoints.down('md')]: {
      marginTop: '14.4rem',
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
  outerLink: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
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
}));

const getUrl = (optOut: Boolean = false) => {
  return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${optOut ? OPTOUT_DURATION : SIGNUP_DURATION}&scope=${optOut ? OPTOUT_SCOPE : SIGNUP_SCOPE}`
}

const setLocalStorage = (optOut: Boolean = false) => {
  localStorage.setItem('isBrowser', 'true')
  localStorage.setItem('optOut', optOut.toString())
}

export default function home(props) {
  const styles = useStyles();
  localStorage.setItem('isBrowser', 'false')

  return (
    <Container maxWidth={false} classes={{ root: style.home }}>
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{ minHeight: '100vh' }}
        classes={{ root: styles.parentGrid }}>
        <Typography variant="h1" display="block" className={`${style.title} ${styles.noSelect} ${styles.title}`}>submatch</Typography>
        <Grid classes={{ root: styles.outerGrid }} container spacing={0} direction="column" alignItems="center" justify="center">
          <Link href={getUrl()} onClick={((e) => setLocalStorage())} underline="none" classes={{ root: styles.outerLink }}>
            <Button classes={{ root: styles.signupBtn, label: styles.label }} size="large">sign up</Button>
          </Link>
          <Hidden mdDown>
            <Typography variant="button" display="block" style={{ marginBottom: '2rem', marginTop: '6rem' }} classes={{ root: styles.noSelect }}>or, if you're already signed up</Typography>
          </Hidden>
          <Link href={getUrl(true)} onClick={((e) => setLocalStorage(true))} underline="none" classes={{ root: styles.outerLink }}>
            <Button variant="outlined" size="large" classes={{ root: styles.optOut }}>unsubscribe</Button>
          </Link>
          <Hidden mdDown>
            <Grid classes={{ root: style.bottomButtons }} direction="row" alignItems="center" justify="center">
              <Link href='https://github.com/LucasAnderson07/RedditSubMatch'>
                <IconButton>
                  <GitHub fontSize="large" />
                </IconButton>
              </Link>
              <Link href='https://www.reddit.com/r/submatch'>
                <IconButton>
                  <Reddit color="secondary" fontSize="large" />
                </IconButton>
              </Link>
            </Grid>
          </Hidden>
        </Grid>
      </Grid>
    </Container>
  );
}
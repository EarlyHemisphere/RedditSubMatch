import * as React from 'react'
import * as style from 'app/global-styles.scss';
import { generateRandomString } from 'app/helpers';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Button } from '@material-ui/core';

const CLIENT_ID = 'BRgd2M3wfJD7Vw';
const CODE = 'code';
const REDIRECT_URI = 'https://www.submatch.io/redirect';
const DURATION = 'temporary';
const SCOPE = 'mysubreddits%20identity';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: '5rem',
    marginTop: '20vh',
    marginBottom: '20vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '6rem',
      marginBottom: '60vh'
    }
  },
  authBtn: {
    [theme.breakpoints.down('md')]: {
      height: 150,
      width: '94%',
      fontSize: '24px',
      borderRadius: 15,
      border: '3px solid',
      position: 'fixed',
      bottom: '30px'
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
    color: 'white',
    [theme.breakpoints.down('md')]: {
      fontSize: '48px'
    }
  }
}));

const setStorage = () => {
  localStorage.setItem('isBrowser', 'true');
  window.sessionStorage.setItem('blacklist', 'false');
  window.sessionStorage.setItem('exclusionList', 'true');
}

const getUrl = () => {
  return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}`;
}

export const SubredditFiltering = () => {
  const styles = useStyles();

  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ height: '100%' }}>
        <Typography display='block' className={`${styles.title} ${style.noSelect} ${style.titleFont}`}>submatch</Typography>
        <Button href={getUrl()} onClick={setStorage} classes={{ root: styles.authBtn, label: styles.label }} size='large'>authorize</Button>
      </Grid>
    </Container>
  );
}
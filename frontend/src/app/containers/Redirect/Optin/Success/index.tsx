import * as React from 'react';
import * as style from '../../style.scss';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Grid } from '@material-ui/core';
import ProjectLinks from '../../../../components/ProjectLinks';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: '3rem',
    marginTop: '5vh',
    marginBottom: '10vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '4rem',
      marginBottom: '10vh',
      marginTop: '2.5vh'
    }
  },
  text: {
    fontSize: '2.5rem',
    marginBottom: '3rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '3rem',
    }
  },
  text2: {
    fontSize: '2rem',
    marginBottom: '3rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.7rem',
    }
  },
}));

export const Success = () => {
  const styles = useStyles();
  
  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ height: '100%', overflow: 'hidden' }}>
        <Typography display='block' id='title' className={`${styles.title} ${style.titleFont} ${style.noSelect}`}>submatch</Typography>
        <Typography display='block' align='center' className={`${styles.text} ${style.noSelect}`}>The signup process is complete!</Typography>
        <Typography display='block' align='center' gutterBottom className={`${styles.text2} ${style.noSelect}`}>To change which subreddits you would like to exclude from matching, please <a href='https://redditsubmatch.com/exclude' style={{ color: 'blue' }}>click here</a>.</Typography>
        <Typography display='block' align='center' gutterBottom className={`${styles.text2} ${style.noSelect}`}>To create or edit a blacklist for users you get matched to, please <a href='https://redditsubmatch.com/blacklist' style={{ color: 'blue' }}>click here</a>.</Typography>
        <Typography display='block' align='center' gutterBottom className={`${styles.text2} ${style.noSelect}`}>For more info or if you have any questions or concerns, head over to <a href='https://www.reddit.com/r/submatch' style={{ color: '#FF4500' }}>r/submatch</a>.</Typography>
        <ProjectLinks style={ style.centeredButtons } />
      </Grid>
    </Container>
  );
}
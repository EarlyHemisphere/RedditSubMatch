import * as React from 'react';
import * as style from '../style.scss';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography } from '@material-ui/core';
import ProjectLinks from '../../../components/ProjectLinks';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: '5rem',
    marginTop: '10vh',
    marginBottom: '10vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '6rem',
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
  success: {
    fontSize: '3rem',
    marginBottom: '5vh',
    color: '#29a329',
  },
  noSelect: {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
  }
}));

export default function Optin() {
  const styles = useStyles();

  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ height: '100%', overflow: 'hidden' }}>
        <Typography display='block' className={`${styles.title} ${style.titleFont} ${styles.noSelect}`}>submatch</Typography>
        <Typography display='block' className={`${styles.success} ${styles.noSelect}`}><b>Success!</b></Typography>
        <Typography display='block' align='center' className={`${styles.text} ${styles.noSelect}`}>You are now participating in regular matching!</Typography>
        <Typography display='block' align='center' gutterBottom className={`${styles.text2} ${styles.noSelect}`}>For more info or if you have any questions or concerns, head over to <a href='https://www.reddit.com/r/submatch' style={{ color: '#FF4500' }}>r/submatch</a>.</Typography>
        <ProjectLinks style={ style.centeredButtons }/>
      </Grid>
    </Container>
  );
}
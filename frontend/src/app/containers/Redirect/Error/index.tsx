import * as React from 'react'
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
    [theme.breakpoints.down('md')]: {
      fontSize: '3rem',
    }
  },
  error: {
    marginBottom: 100,
    fontFamily: 'Lucida Console'
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

export const Error = ({response}) => {
  const styles = useStyles();

  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid container
        spacing={0}
        direction='column'
        alignItems='center'
        justify='flex-start'
        style={{ height: '100%' }}>
        <Typography display='block' className={`${styles.title} ${style.titleFont} ${styles.noSelect}`}>submatch</Typography>
        <Grid
          direction='row'
          justify='center'
          alignItems='flex-start'
          style={{ height: '200px'}}>
          <Typography align='center' className={`${styles.text} ${styles.noSelect}`} display='block'>Error while attempting action:</Typography>
          <Typography align='center' className={`${styles.text} ${styles.error}`} display='block'>{response.message}</Typography>
          <Typography align='center' className={`${styles.text} ${styles.noSelect}`} display='block'>Please try again later.</Typography>
        </Grid>
        <ProjectLinks style={ style.centeredButtons }/>
      </Grid>
    </Container>
  );
}
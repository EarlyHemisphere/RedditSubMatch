import * as React from 'react';
import * as style from '../style.scss';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography } from '@material-ui/core';
import ProjectLinks from '../../../components/ProjectLinks';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: '3rem',
    marginTop: '5vh',
    marginBottom: '10vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '4rem',
      marginBottom: '20vh',
      marginTop: '2.5vh'
    }
  },
  text: {
    fontSize: '2.5rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '3rem',
    }
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

export default function Optout() {
  const styles = useStyles();

  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ height: '100%', overflow: 'hidden' }}>
        <Typography display='block' className={`${styles.title} ${style.titleFont} ${styles.noSelect}`}>submatch</Typography>
        <Typography display='block' align='center' gutterBottom className={`${styles.text} ${styles.noSelect}`}>
          You have been <b style={{ color: '#29a329' }}>removed</b> from matching and any data you've given us has been deleted.
        </Typography>
        <ProjectLinks style={ style.centeredButtons }/>
      </Grid>
    </Container>
  );
}
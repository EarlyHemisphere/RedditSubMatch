import * as React from 'react'
import * as style from '../style.scss';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: '3rem',
    marginTop: '5vh',
    marginBottom: '10vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '4rem',
      marginTop: '2.5vh'
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

export const Loading = () => {
  const styles = useStyles();

  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ height: '100%' }}>
        <Typography display='block' className={`${styles.title} ${styles.noSelect} ${style.titleFont}`}>submatch</Typography>
        <Backdrop open={true} style={{ zIndex: 1 }}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Grid>
    </Container>
  )
}
import * as React from 'react';
import { Grid, IconButton, Link, makeStyles, Theme, createStyles } from '@material-ui/core';
import { GitHub, Reddit } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => createStyles({
  icon: {
    fontSize: '30px',
    [theme.breakpoints.down('md')]: {
      fontSize: '75px'
    }
  }
}));

export default function ProjectLinks({ style }) {
  const styles = useStyles();

  return (
    <Grid classes={{ root: style }}>
      <Link href='https://github.com/LucasAnderson07/RedditSubMatch'>
        <IconButton>
          <GitHub classes={{ root: styles.icon }} />
        </IconButton>
      </Link>
      <Link href='https://www.reddit.com/r/submatch'>
        <IconButton>
          <Reddit color='secondary' classes={{ root: styles.icon }} />
        </IconButton>
      </Link>
    </Grid>
  )
}
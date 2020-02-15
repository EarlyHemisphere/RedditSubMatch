import * as React from 'react';
import * as style from '../style.scss';
import { Container, Grid, Typography, Hidden, Link, IconButton } from '@material-ui/core';
import { GitHub, Reddit } from '@material-ui/icons';

export default function Optout(props) {


    return (
        <Container maxWidth={false} classes={{ root: style.normal }}>
            <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ minHeight: '100vh' }}>
                <Typography variant="h3" display="block" classes={{ root: style.title }}>submatch</Typography>
                <Typography variant="h4" display="block" gutterBottom classes={{ root: style.text }}>
                    You have been <b style={{ color: '#29a329' }}>removed</b> from matching
                </Typography>
                <Typography variant="h5" display="block" classes={{ root: style.text }} style={{ marginBottom: '4rem' }}>and your data has been deleted.</Typography>
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
        </Container>
    );
}
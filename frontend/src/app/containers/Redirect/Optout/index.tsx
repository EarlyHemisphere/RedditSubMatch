import * as React from 'react';
import * as style from '../style.scss';
import { Container, Grid, Typography } from '@material-ui/core';

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
                <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>
                    You can always <a href='https://www.reddit-submatch.firebaseapp.com' style={{ color: 'yellow' }}>opt in</a>
                </Typography>
                <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>
                    or visit <a href='https://www.reddit.com/r/submatch' style={{ color: '#FF4500' }}>the subreddit</a> for updates about matching and community events.
            </Typography>
            </Grid>
        </Container>
    );
}
import * as React from 'react';
import * as style from '../style.scss';
import { Container, Grid, Typography } from '@material-ui/core';

export default function Optin(props) {


    return (
        <Container maxWidth={false} classes={{ root: style.normal }}>
            <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ minHeight: '100vh' }}>
                <Typography variant="h3" display="block" classes={{ root: style.title }}>submatch</Typography>
                <Typography variant="h2" display="block" classes={{ root: style.text }} style={{ color: '#29a329', marginBottom: '6rem' }}><b>Success!</b></Typography>
                <Typography variant="h4" display="block" classes={{ root: style.text }} style={{ marginBottom: '3rem' }}>You are now participating in regular matching!</Typography>
                <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>For more info or if you have any questions or concerns,</Typography>
                <Typography variant="h5" display="block" gutterBottom classes={{ root: style.text }}>
                    head over to <a href='https://www.reddit.com/r/submatch' style={{ color: '#FF4500' }}>r/submatch</a>.</Typography>
            </Grid>
        </Container>
    );
}
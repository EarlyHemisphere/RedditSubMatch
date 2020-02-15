import * as React from 'react'
import * as style from '../style.scss';
import { Container, Grid, Typography } from '@material-ui/core';

export const Error = ({response}) => {
    return (
        <Container maxWidth={false} classes={{ root: style.normal }}>
        	<Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="flex-start"
                style={{ minHeight: '100vh' }}>
                <Typography variant="h3" display="block" classes={{ root: style.title }}>submatch</Typography>
                <Grid
                	direction="row"
                	alignItems="flex-start"
                	justify="center"
                	style={{ height: '200px', width: '40%'}}>
                	<Typography variant="h4" display="block">API Error:</Typography>
                	<Typography variant="h5" display="block" style={{ marginBottom: 100, fontFamily: "Lucida Console"}}>{response.message}</Typography>
                	<Typography variant="h4" display="block">Please try again later.</Typography>
                </Grid>
            </Grid>
        </Container>
    )
}
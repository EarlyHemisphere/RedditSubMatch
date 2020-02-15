import * as React from 'react'
import * as style from '../style.scss';
import { Container, Grid, Typography, Hidden, Link, IconButton } from '@material-ui/core';
import { GitHub, Reddit } from '@material-ui/icons';

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
            </Grid>
        </Container>
    )
}
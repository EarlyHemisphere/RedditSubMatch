import * as React from 'react'
import * as style from '../style.scss';
import { Container, Grid, Typography, Backdrop, CircularProgress } from '@material-ui/core';

export const Loading = (props) => {
    return (
        <Container maxWidth={false} classes={{ root: style.normal }}>
        	<Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ minHeight: '100vh' }}>
                <Typography variant="h3" display="block" classes={{ root: style.title }}>submatch</Typography>
        		<Backdrop open={true} style={{ zIndex: 1 }}>
        			<CircularProgress color="inherit" />
      			</Backdrop>
      		</Grid>
        </Container>
    )
}
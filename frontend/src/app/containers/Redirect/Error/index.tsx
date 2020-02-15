import * as React from 'react'
import * as style from '../style.scss';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Hidden, Link, IconButton } from '@material-ui/core';
import { GitHub, Reddit } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => createStyles({
    title: {
        fontSize: '5rem',
        marginTop: '20vh',
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
        fontFamily: "Lucida Console"
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
                direction="column"
                alignItems="center"
                justify="flex-start"
                style={{ minHeight: '100vh' }}>
                <Typography display="block" className={`${styles.title} ${style.titleFont} ${styles.noSelect}`}>submatch</Typography>
                <Grid
                	direction="row"
                	alignItems="flex-start"
                	justify="center"
                	style={{ height: '200px'}}>
                	<Typography align="center" className={`${styles.text} ${styles.noSelect}`} display="block">API Error:</Typography>
                	<Typography align="center" className={`${styles.text} ${styles.error}`} display="block">response.message</Typography>
                	<Typography align="center" className={`${styles.text} ${styles.noSelect}`} display="block">Please try again later.</Typography>
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
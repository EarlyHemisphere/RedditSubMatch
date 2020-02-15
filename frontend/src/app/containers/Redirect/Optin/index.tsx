import * as React from 'react';
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
        marginBottom: '3rem',
        [theme.breakpoints.down('md')]: {
            fontSize: '3rem',
        }
    },
    success: {
        fontSize: '3rem',
        marginBottom: '6rem',
        color: '#29a329',
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

export default function Optin(props) {
    const styles = useStyles();

    return (
        <Container maxWidth={false} classes={{ root: style.normal }}>
            <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ minHeight: '100vh' }}>
                <Typography display="block" className={`${styles.title} ${style.titleFont} ${styles.noSelect}`}>submatch</Typography>
                <Typography display="block" className={`${styles.success} ${styles.noSelect}`}><b>Success!</b></Typography>
                <Typography display="block" align="center" className={`${styles.text} ${styles.noSelect}`}>You are now participating in regular matching!</Typography>
                <Typography display="block" align="center" gutterBottom className={`${styles.text} ${styles.noSelect}`}>For more info or if you have any questions or concerns, head over to <a href='https://www.reddit.com/r/submatch' style={{ color: '#FF4500' }}>r/submatch</a>.</Typography>
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
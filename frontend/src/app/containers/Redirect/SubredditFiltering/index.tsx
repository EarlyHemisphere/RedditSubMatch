import * as React from 'react';
import * as style from 'app/global-styles.scss';
import { firebaseFunctions } from 'app/firebase/base';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, Button, Grid, CircularProgress, Backdrop, Hidden, Snackbar, Container } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import SearchInput from 'app/components/SearchInput';
import ProjectLinks from 'app/components/ProjectLinks';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: '3rem',
    marginTop: '5vh',
    marginBottom: '10vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '4rem',
      marginBottom: '4vh',
      marginTop: '2.5vh'
    }
  },
  subSelectionText: {
    fontSize: '1.4rem',
    textAlign: 'center'
  },
  list: {
    padding: 0,
    maxHeight: '100%'
  },
  listItem: {
    fontSize: '40px'
  },
  submitBtn: {
    height: 80,
    width: 250,
    borderRadius: 15,
    color: 'white',
    backgroundColor: '#ff8100',
    '&:hover': {
      backgroundColor: '#f57c00'
    },
    [theme.breakpoints.down('md')]: {
      width: '46%',
      height: 150,
    }
  },
  skipBtn: {
    height: 80,
    width: 250,
    borderRadius: 15,
    marginRight: 10,
    [theme.breakpoints.down('md')]: {
      width: '46%',
      marginRight: '3%',
      height: 150,
    }
  },
  submitBtnLabel: {
    fontSize: '24px',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      fontSize: '48px'
    }
  },
  skipBtnLabel: {
    fontSize: '24px',
    [theme.breakpoints.down('md')]: {
      fontSize: '48px'
    }
  },
  outerGrid: {
    minHeight: '10rem',
    marginTop: '3rem',
    width: '25rem',
    [theme.breakpoints.down('md')]: {
      width: '98%',
      maxHeight: 'calc(100% - 210px - 6.5vh - 69px - 38px - 1rem - 66px)'
    },
    maxHeight: '100%'
  },
  listGrid: {
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
    backgroundColor: 'white',
    width: '100%',
  },
  selectAllBtn: {
    width: '100%',
    marginBottom: '0.5rem',
    color: 'white',
    [theme.breakpoints.down('md')]: {
      height: 80,
    }
  },
  selectAllLabel: {
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      fontSize: '28px'
    }
  },
  successText: {
    color: 'green',
    display: 'inline-block',
    marginRight: '5px',
  },
  successMsgText: {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  btnsContainer: {
    position: 'fixed',
    bottom: 50,
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      bottom: 30,
    }
  },
  snackBarRoot: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }
  },
  alertRoot: {
    [theme.breakpoints.down('md')]: {
      fontSize: '30px'
    }
  },
  alertIcon: {
    [theme.breakpoints.down('md')]: {
      fontSize: '40px'
    }
  },
  note: {
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '1rem'
  }
}));

interface Props {
  accessToken: string;
  subreddits: string[];
  exclusionList?: string[];
  completionFn?: (data: any) => void;
  fromSignup?: boolean;
}

export const SubredditFiltering = (props: Props) => {
  const styles = useStyles();
  const subredditsChecked = {};
  const { accessToken, subreddits, exclusionList, completionFn, fromSignup } = props;

  const setHeights = () => {
    const btnsContainer = document.getElementById('btnsContainer')!;
    if (!btnsContainer) {
      return; // page is not displayed yet
    }
    const title = document.getElementById('title')!;
    const successMsg = fromSignup ? document.getElementById('successMsg')! : null;
    const subSelectionMsg = document.getElementById('subSelectionMsg')!;
    const note = document.getElementById('note')!;
    const outerGrid = document.getElementById('outerGrid')!;
    outerGrid.style.height = `calc(100% - ${window.getComputedStyle(title).marginTop} - ${title.clientHeight}px - ${window.getComputedStyle(title).marginBottom} - ${successMsg != null ? successMsg.clientHeight : '0'}px - ${successMsg != null ? window.getComputedStyle(successMsg).marginBottom : '0px'} - ${subSelectionMsg.clientHeight}px - ${window.getComputedStyle(note).marginTop} - ${note.clientHeight}px - ${window.getComputedStyle(outerGrid).marginTop} - ${window.getComputedStyle(btnsContainer).bottom} - ${btnsContainer.clientHeight}px - 30px)`;
  
    const selectAllBtn = document.getElementById('selectAllBtn')!;
    const searchInput = document.getElementById('searchInput')!;
    const list = document.getElementById('list')!;
    list.style.maxHeight = `calc(${window.getComputedStyle(outerGrid).height} - ${selectAllBtn.clientHeight}px - ${window.getComputedStyle(selectAllBtn).marginBottom} - ${searchInput.clientHeight}px)`;
  }

  React.useEffect(() => {
    setHeights();
    window.addEventListener('resize', setHeights, true);
    window.addEventListener('load', setHeights, true);
    window.addEventListener('DOMContentLoaded', setHeights, true);
    return () => {
      window.removeEventListener('resize', setHeights, true);
      window.removeEventListener('load', setHeights, true);
      window.removeEventListener('DOMContentLoaded', setHeights, true);
    }
  }, []);
  
  subreddits.sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()));

  subreddits.forEach((subreddit: string) => {
    subredditsChecked[subreddit] = exclusionList ? exclusionList.includes(subreddit) : false;
  });

  const [checked, setChecked] = React.useState(subredditsChecked);
  const [visible, setVisible] = React.useState([ ...subreddits ]);
  const [selectAll, setSelectAll] = React.useState(true);
  const [visibleSelected, setVisibleSelected] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [cloudErrorSnackbarOpen, setCloudErrorSnackbarOpen] = React.useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);

  const handleToggle = (subreddit: string) => () => {
    const newChecked = { ...checked };
    newChecked[subreddit] = !newChecked[subreddit];
    setChecked(newChecked);
  }

  const selectAllOrNone = () => () => {
    const newChecked = { ...checked };

    visible.forEach((subreddit: string) => {
      newChecked[subreddit] = visible.length < subreddits.length ? !visibleSelected : selectAll;
    });
    
    if (visible.length < subreddits.length) {
      setVisibleSelected(!visibleSelected);
    } else {
      setVisibleSelected(false);
      setSelectAll(!selectAll);
    }
    setChecked(newChecked);
  }

  const filterSubreddits = (e: any) => {
    const searchFieldVal = e.target.value.toLowerCase();
    const newVisible: string[] = [];
    
    subreddits.forEach((subreddit: string) => {
      if (subreddit.toLowerCase().includes(searchFieldVal)) {
        newVisible.push(subreddit);
      }
    });

    if (newVisible.length != visible.length && newVisible.some(subreddit => !checked[subreddit])) {
      setVisibleSelected(false);
    }

    setVisible(newVisible);
  }

  const submissionComplete = (data: any) => {
    if (data.ok) {
      if (completionFn) {
        completionFn(data);
      } else {
        setSuccessSnackbarOpen(true);
      }
    } else {
      setCloudErrorSnackbarOpen(true);
      console.log(data);
    }
  }

  const submitExclusionList = () => {
    const exclusionList = Object.entries(checked).filter(([key, val]) => val).map(([key, val]) => key);

    if (exclusionList.length == subreddits.length) {
      setErrorSnackbarOpen(true);
    } else if (!exclusionList.length) {
      submissionComplete({ ok: true });
    } else {
      setLoading(true);
      const saveExclusionList = firebaseFunctions.httpsCallable('saveExclusionList');
      saveExclusionList({ accessToken, exclusionList }).then(r => {
        setLoading(false);
        submissionComplete(r.data);
      });
    } 
  }

  const closeSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  }
  
  const closeErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  }
  
  const closeCloudErrorSnackbar = () => {
    setCloudErrorSnackbarOpen(false);
  }

  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ height: '100%', overflow: 'hidden' }}>
        <Typography display='block' id='title' className={`${styles.title} ${style.titleFont} ${style.noSelect}`}>submatch</Typography>
        {
          fromSignup ? 
            <>
              <Typography id='successMsg' display='block' className={`${styles.successMsgText} ${style.noSelect}`}>
                <span className={styles.successText}><b>Success!</b></span>
                You are now signed up for regular matching.
              </Typography>
            </> : <></>
        }
        <Typography id='subSelectionMsg' display='block' className={`${styles.subSelectionText} ${style.noSelect}`}>Please select any subscribed subreddits you would like to <i><b>exclude</b></i> from being considered when finding a match for you:</Typography>
        <Typography id='note' display='block' className={`${styles.note} ${style.noSelect}`}><b>Note</b>: Please use sparingly - excluding too many subreddits may decrease the quality of your match.</Typography>
        <Grid
          container
          direction='column'
          alignItems='center'
          id='outerGrid'
          classes={{ root: styles.outerGrid }}>
          <Button id='selectAllBtn' size='large' variant='contained' color='primary' onClick={selectAllOrNone()} classes={{ root: styles.selectAllBtn, label: styles.selectAllLabel }}>{ visible.length < subreddits.length ? !visibleSelected ? 'Select Visible' : 'Deselect Visible' : selectAll ? 'Select All' : 'Select None' }</Button>
          <SearchInput inputFn={filterSubreddits}/>
          <Grid classes={{ root: styles.listGrid }}>
            <List id='list' classes={{ root: styles.list }}>
              { visible.map((subreddit: string) => {
                return (
                  <ListItem key={subreddit} dense button disableRipple onClick={handleToggle(subreddit)}>
                    <ListItemIcon>
                      <Checkbox
                        edge='start'
                        color='primary'
                        checked={checked[subreddit]}
                        size='small'
                        tabIndex={-1}
                        disableRipple
                        disableFocusRipple
                        style={{ backgroundColor: 'transparent' }}
                        inputProps={{ 'aria-labelledby': subreddit }}
                      />
                    </ListItemIcon>
                    <ListItemText id={subreddit} primary={subreddit} primaryTypographyProps={{ variant: 'h6', noWrap: true }}/>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
        <div id='btnsContainer' className={styles.btnsContainer}>
          {
            fromSignup
              ? <Button onClick={() => submissionComplete({ ok: true })} size='large' variant='outlined' classes={{ root: styles.skipBtn, label: styles.skipBtnLabel }}>Skip</Button>
              : <></>
          }
          <Button onClick={submitExclusionList} disabled={JSON.stringify(Object.entries(checked).filter(([key, val]) => val).map(([key, val]) => key)) == JSON.stringify(exclusionList) || Object.keys(checked).length < 1} size='large' variant='contained' classes={{ root: styles.submitBtn, label: styles.submitBtnLabel }}>Submit</Button>
        </div>
        <Hidden mdDown>
          <ProjectLinks style={style.bottomButtons}/>
        </Hidden>
        <Backdrop open={loading} style={{ zIndex: 1 }}>
          <CircularProgress color='primary' />
        </Backdrop>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={5000}
          onClose={closeErrorSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          classes={{ root: styles.snackBarRoot }}>
          <MuiAlert elevation={6} variant='filled' severity='error' classes={{ root: styles.alertRoot, icon: styles.alertIcon }}>Please leave at least one subreddit deselected.</MuiAlert>
        </Snackbar>
        <Snackbar
          open={cloudErrorSnackbarOpen}
          autoHideDuration={5000}
          onClose={closeCloudErrorSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          classes={{ root: styles.snackBarRoot }}>
          <MuiAlert elevation={6} variant='filled' severity='error' classes={{ root: styles.alertRoot, icon: styles.alertIcon }}>An error occurred when submitting your exclusion list. Please try again later.</MuiAlert>
        </Snackbar>
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={5000}
          onClose={closeSuccessSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          classes={{ root: styles.snackBarRoot }}>
          <MuiAlert elevation={6} variant='filled' severity='success' classes={{ root: styles.alertRoot, icon: styles.alertIcon }}>Your exclusion list has been successfully updated!</MuiAlert>
        </Snackbar>
      </Grid>
    </Container>
  );
}
import * as React from 'react'
import * as style from './style.scss';
import { firebaseFunctions } from 'app/firebase/base';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, TextField, Button, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { purple, blue } from '@material-ui/core/colors';
import { useAsync } from "react-async"

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: '5rem',
    marginTop: '20vh',
    marginBottom: '10vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '6rem',
    }
  },
  noSelect: {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
  },
  label: {
    fontSize: '24px',
    color: 'white'
  },
  currentBlacklistLabel: {
    fontSize: '24px',
    marginBottom: '3vh',
    [theme.breakpoints.down('md')]: {
      fontSize: '40px'
    }
  },
  blacklist: {
    fontSize: '28px',
    width: '50vw',
    marginBottom: '10vh',
    [theme.breakpoints.down('md')]: {
      width: '80%',
      marginBottom: '17vh'
    }
  },
  blacklistText: {
    fontSize: '20px',
    [theme.breakpoints.down('md')]: {
      fontSize: '40px'
    }
  },
  updateBtn: {
    [theme.breakpoints.down('md')]: {
      height: 100,
      width: '100%',
      fontSize: '24px',
      borderRadius: 15,
      border: '3px solid',
      borderColor: 'black',
      marginTop: 'auto',
      marginBottom: '2rem',
    },
    height: 80,
    width: 250,
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
    '&:disabled': {
      backgroundColor: purple[600],
      opacity: '0.5'
    }
  },
  helperText: {
    [theme.breakpoints.down('md')]: {
      fontSize: '28px'
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
  }
}));

const updateBlacklist = async (newBlacklist) => {
  const saveBlacklist = firebaseFunctions.httpsCallable("saveBlacklist")
  await saveBlacklist({ accessToken: window.sessionStorage.getItem('token'), blacklist: newBlacklist})
}

export const Blacklist = (props) => {
  const styles = useStyles();
  const username = window.sessionStorage.getItem('username')
  let blacklist = window.sessionStorage.getItem('currentBlacklist')
  const [textFieldValue, setTextFieldValue] = React.useState(blacklist)
  const [blacklistChanged, setBlacklistChanged] = React.useState(false)
  const [helperText, setHelperText] = React.useState("Enter a list of usernames seperated by commas")
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false)
  const usernameRegex = RegExp("^[A-Za-z0-9_-]+$")

  const openSuccessSnackbar = () => {
    setSuccessSnackbarOpen(true)
    window.sessionStorage.setItem('currentBlacklist', textFieldValue)
    blacklist = textFieldValue
  }

  const openErrorSnackbar = (e) => {
    setSuccessSnackbarOpen(false)
    setBlacklistChanged(true)
    setErrorSnackbarOpen(true)
  }

  const { isPending, error, run } = useAsync({ deferFn: updateBlacklist, onResolve: openSuccessSnackbar, onReject: openErrorSnackbar })

  const textFieldChange = (e) => {
    let newVal = e.target.value
    setTextFieldValue(newVal)
    if (newVal.replace(/\s/g, "") == blacklist.replace(/\s/g, "")) {
      setBlacklistChanged(false)
    } else {
      setBlacklistChanged(true)
    }
    let usernames = newVal.split(",")
    let usernamesValid = usernames.every((username) => {
      username = username.trim()
      if (username.length < 3 || username.length > 20) {
        setHelperText("All usernames have to be 3-20 characters long")
        return false
      } else if (!usernameRegex.test(username)) {
        setHelperText("One or more usernames contain invalid characters")
        return false
      } else if (username.toLowerCase() == window.sessionStorage.getItem('username').toLowerCase()) {
        setHelperText("You cannot include your own username in the blacklist")
        return false
      }
      return true
    })
    if ((new Set(usernames)).size !== usernames.length) {
      setHelperText("Duplicate usernames are not allowed")
    } else if (usernamesValid) {
      setHelperText("Enter a list of usernames seperated by commas")
    }
  }

  const handleUpdateClick = (e) => {
    let newBlacklist = []
    const usernames = textFieldValue.split(',')
    usernames.forEach((username) => {
      newBlacklist.push(username.trim())
    })
    run(newBlacklist)
    setBlacklistChanged(false)
  }

  const closeSuccessSnackbar = (e) => {
    setSuccessSnackbarOpen(false)
  }

  const closeErrorSnackbar = (e) => {
    setErrorSnackbarOpen(false)
  }

  return (
    <Container maxWidth={false} classes={{ root: style.normal }}>
      <Grid container
            spacing={0}
            direction="column"
            alignItems="center"
            style={{ minHeight: '100vh' }}>
        <Typography display="block" className={`${styles.title} ${styles.noSelect} ${style.titleFont}`}>submatch</Typography>
        <Typography display="block" className={`${styles.noSelect} ${styles.currentBlacklistLabel}`}>{username}'s current blacklist:</Typography>
        <TextField 
          variant="outlined"
          classes={{ root: styles.blacklist }}
          InputProps={{ classes: { input: styles.blacklistText } }}
          FormHelperTextProps={{ classes: { root: styles.helperText } }}
          value={textFieldValue}
          onChange={textFieldChange}
          helperText={helperText}
          error={helperText != "Enter a list of usernames seperated by commas"}></TextField>
        <Button
          onClick={handleUpdateClick}
          variant="contained"
          classes={{ root: styles.updateBtn, label: styles.label }}
          size="large"
          disabled={!blacklistChanged || helperText != "Enter a list of usernames seperated by commas"}>
          {
            isPending
              ? <CircularProgress/>
              : "update"
          }
        </Button>
      </Grid>
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={5000}
        onClose={closeSuccessSnackbar}
        bodyStyle={styles.snackBar}
        onActionTouchTap={closeSuccessSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        classes={{ root: styles.snackBarRoot }}>
        <MuiAlert elevation={6} variant="filled" severity="success" classes={{ root: styles.alertRoot, icon: styles.alertIcon }}>Blacklist updated!</MuiAlert>
      </Snackbar>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={5000}
        onClose={closeErrorSnackbar}
        bodyStyle={styles.snackBar}
        onActionTouchTap={closeErrorSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        classes={{ root: styles.snackBarRoot }}>
        <MuiAlert elevation={6} variant="filled" severity="error" classes={{ root: styles.alertRoot, icon: styles.alertIcon }}>There was an error updating your blacklist. Please try again later.</MuiAlert>
      </Snackbar>
    </Container>
  )
}

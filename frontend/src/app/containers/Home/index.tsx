import * as React from 'react';
import * as style from './style.scss';
import { generateRandomString } from 'app/helpers';

interface Props{
}
interface State {
}

const CLIENT_ID = 'BRgd2M3wfJD7Vw'
const CODE = 'code'
const REDIRECT_URI = 'https://reddit-submatch.web.app/success'
const SIGNUP_DURATION = 'permanent'
const OPTOUT_DURATION = 'temporary'
const SIGNUP_SCOPE = 'mysubreddits%20identity'
const OPTOUT_SCOPE = 'identity'

export class Home extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context)
  }
  getUrl = (optOut: Boolean = false) => {
    return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${optOut ? OPTOUT_DURATION : SIGNUP_DURATION}&scope=${optOut ? OPTOUT_SCOPE : SIGNUP_SCOPE}`
  }
  setLocalStorage = (optOut: Boolean = false) => {
    console.log('setLocalStorage')
    console.log(optOut)
    localStorage.setItem('optOut', optOut.toString())
    console.log(localStorage.getItem('optOut'))
  }
  render() {
    return (
      <div className={style.home}>
        <a id='submitUserInfo' href={this.getUrl()} onClick={((e) => this.setLocalStorage())}> Click here to authenticate </a>
        <a id='deleteUserInfo' href={this.getUrl(true)} onClick={((e) => this.setLocalStorage(true))}> Click here to opt out </a>
      </div>
    );
  }
}

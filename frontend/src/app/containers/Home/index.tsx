import * as React from 'react';
import * as style from './style.scss';
import { generateRandomString } from 'app/helpers';
import { Link } from 'react-router';

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
  render() {
    return (
      <div className={style.home}>
        <Link to={{
          pathname: this.getUrl(),
          data: {}
        }}> Click here to authenticate </Link>
        <Link to={{
          pathname: this.getUrl(true),
          data: { optOut: true }
        }}> Click here to opt out </Link>
      </div>
    );
  }
}

import * as React from 'react';
import * as style from './style.scss';
import { firebaseFunctions } from 'app/firebase/base';
import { generateRandomString } from 'app/helpers';


interface Props{
}
interface State {
  username: string
  password: string
}

const CLIENT_ID = "BRgd2M3wfJD7Vw"
const CODE = 'code'
const REDIRECT_URI = "https://reddit-submatch.web.app/success"
const DURATION = "temporary"
const SCOPE = "mysubreddits%20identity"



export class Home extends React.Component<Props, State> {

  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      username: "",
      password: "",
    };
  }
  getUrl = () => {
    return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}`
  }
  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value} as Pick<State, keyof State>)
  }
  onSubmit = () => {

  }
  render() {
    return (
      <div className={style.home}>
        <a href={this.getUrl()}> Click here to authenticate </a>
      </div>
    );
  }
}

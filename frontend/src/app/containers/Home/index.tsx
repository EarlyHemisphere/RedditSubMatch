import * as React from 'react';
import * as style from './style.scss';
import { firebaseFunctions, db } from 'app/firebase/base';
import { generateRandomString } from 'app/helpers';

const sizeof = require('sizeof')

interface Props{
}
interface State {
}

const CLIENT_ID = "BRgd2M3wfJD7Vw"
const CODE = 'code'
const REDIRECT_URI = "https://reddit-submatch.web.app/success"
const DURATION = "temporary"
const SCOPE = "mysubreddits%20identity"



export class Home extends React.Component<Props, State> {

  constructor(props: Props, context: any) {
    super(props, context);
    // this.test()
    this.state = {
    };
  }
  getUrl = () => {
    return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${CODE}&state=${generateRandomString()}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}`
  }
  test = () => {
    // db.collection("users").doc("theC4T").get().then((doc)=>{
    //   console.log(doc.data())
    //   console.log(doc)
    //   console.log(sizeof.sizeof(doc.data(), true))
    // })
    // db.collection("users").add({test: "test"})
  }
  render() {
    return (
      <div className={style.home}>
        <a href={this.getUrl()}> Click here to authenticate </a>
      </div>
    );
  }
}

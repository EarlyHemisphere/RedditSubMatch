import * as React from 'react';
import { SubredditFiltering } from '../SubredditFiltering';
import { Success } from './Success';
import { Error } from '../Error';

export default function Optin({ accessToken, subreddits, exclusionList }) {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const exclusionStepComplete = (responseData: any) => {
    if (responseData.ok) {
      setSuccess(true);
    } else {
      setError(responseData.message);
    }
  }

  return error
    ? <Error response={{ message: error }} />
    : success
      ? <Success />
      : <SubredditFiltering accessToken={accessToken} subreddits={subreddits} completionFn={exclusionStepComplete} fromSignup={true} exclusionList={exclusionList}/>;
}
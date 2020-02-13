import * as React from 'react';
import * as qs from 'query-string'
import { firebaseFunctions } from 'app/firebase/base';
import Optout from './Optout';
import Optin from './Optin';
import { Loading } from './Loading';
import { Error } from './Error';



const renderSuccess = (loading, response, component) => {
  if(loading){
    return <Loading/>
  }
  if(response.ok == false){
    return <Error response={response}/>
  }
  return component
}

export const Success = (props) => {
  const data = { code: qs.parse(props.location.search).code }
  const [loading, setLoading] = React.useState(true);
  const [response, setResponse] = React.useState({})
  const optOut = localStorage.getItem('optOut') == 'true'
  if (optOut) {
    const deleteUserInfo = firebaseFunctions.httpsCallable("deleteUserInfo")
    deleteUserInfo(data).then((r)=>{
      setLoading(false)
      setResponse(r)
    });
    return renderSuccess(loading, response, <Optout/>)
  } else {
    const submitUserLogin = firebaseFunctions.httpsCallable("submitUserLogin")
    submitUserLogin(data).then(()=>{
      setLoading(false)
      setResponse(response)
    });
    return renderSuccess(loading, response, <Optin/>)
  }
}
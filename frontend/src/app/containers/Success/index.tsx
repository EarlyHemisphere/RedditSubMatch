import * as React from 'react';
import * as style from './style.scss';
import * as qs from 'query-string'
import { RouteComponentProps } from 'react-router';
import { firebaseFunctions } from 'app/firebase/base';

interface Props extends RouteComponentProps<null>{
}
interface State {
}

export class Success extends React.Component<Props, State> {

  constructor(props: Props, context: any) {
    super(props, context);

    const q = qs.parse(this.props.location.search)
    const submitUserLogin = firebaseFunctions.httpsCallable("submitUserLogin")
    console.log(localStorage.getItem("optOut"))
    submitUserLogin({code: q.code});
  }
  render() {
    return (
      <div className={style.normal}>Success</div>
    );
  }
}

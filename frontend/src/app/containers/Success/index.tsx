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
    submitUserLogin({code: q.code});

    this.state = {
    };
  }
  render() {
    return (
      <div
        className={style.normal}
      >
        Success
      </div>
    );
  }
}

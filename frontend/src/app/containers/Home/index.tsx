import * as React from 'react';
import * as style from './style.scss';
import { GLOBAL_STATE } from 'app/constants';
import { GlobalStateStore } from 'app/stores';


export interface HomeProps{
}
export interface HomeState {
}


export class Home extends React.Component<HomeProps, HomeState> {

  constructor(props: HomeProps, context: any) {
    super(props, context);
    this.state = {
    };
  }
  render() {
    return (
      <div
        className={style.normal}
      >
      Home
      </div>
    );
  }
}

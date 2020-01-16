import * as React from 'react';
import * as style from './style.scss';

export class Root extends React.Component<any, any> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return <DevTools />;
    }
    return (<div>no dev tools</div>);
  }

  render() {
    return (
      <div className={style.normal}>
        {this.props.children}
        {/* {this.renderDevTool()} */}
      </div>
    );
  }
}

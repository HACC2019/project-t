import React, { Component } from 'react';
import { Resizable } from 're-resizable';
import DashView from './DashView';
import style from './dashboard.scss';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'summary'
    }
  }

  render() {
    return (
      <Resizable className={style.box}
                    defaultSize={{height: 300}}
                    minHeight={'20%'}
                    enable={{bottom: true}}
                    >
        <DashView analytics={this.props.analytics} />
      </Resizable>
    )
  }
}

export default Dashboard;
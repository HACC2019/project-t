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
        <DashView analytics={this.props.analytics} />
    )
  }
}

export default Dashboard;
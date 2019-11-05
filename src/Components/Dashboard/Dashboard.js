import React, { Component } from 'react';
import DashView from './DashView';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'summary'
    }
  }

  render() {
    return (
        <DashView />
    )
  }
}

export default Dashboard;
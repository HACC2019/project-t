import React, { Component } from 'react';
import SummaryView from './SummaryView';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'summary'
    }
  }

  render() {
    return (
        <SummaryView analytics={this.props.analytics} />
    );
  }
}

export default Dashboard;
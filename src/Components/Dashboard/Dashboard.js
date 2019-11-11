import React, { Component } from 'react';
import { ResizableBox } from 'react-resizable';
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
      <ResizableBox className={style.box} axis="y"
                    height={600}
                    minConstraints={[200, 300]}
                    handleSize={[20,20]}
                    >
        <DashView />
      </ResizableBox>
    )
  }
}

export default Dashboard;
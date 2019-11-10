import React, {Component} from 'react';

const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export class SimulationController extends Component {
  constructor(props) {
    super(props);

    this.state = {
        running: false
    }

    this.nextDay = this.nextDay.bind(this);
    this.previousDay = this.previousDay.bind(this);
    this.nextWeek = this.nextWeek.bind(this);
    this.previousWeek = this.previousWeek.bind(this);
    this.toggleSimulation = this.toggleSimulation.bind(this);
    this.runSimulation = this.runSimulation.bind(this);
    this.props.controller.addListener(this.render.bind(this));
  }

  nextDay() {
    this.props.controller.nextDay();
  }

  previousDay() {
    this.props.controller.previousDay();
  }

  nextWeek() {
    this.props.controller.nextWeek();
  }

  previousWeek() {
    this.props.controller.previousWeek();
  }

    toggleSimulation() {
        this.setState({running: !this.state.running}, () => {
            if (this.state.running) {
                this.runSimulation();
            } else {
                clearTimeout(this._timeout);
            }
        });
    }

    runSimulation() {
        this.props.controller.nextDay();
        this._timeout = setTimeout(this.runSimulation, 100);
    }

  render() {
    let date = new Date(this.props.controller.getTime());

    return (
      <div style={{ display: 'flex', flexDirection: 'row', height: '3em', padding: '0 1em', background: '#111116', color: '#FFF'}}>
        <div style={{margin: 'auto 0'}}>Week of {weekDayNames[date.getDay()]}, {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()} (week {this.props.controller.getWeekNumber()})</div>
        <div style={{flex: 1}} />
        <button onClick={this.previousWeek}>&lt;&lt;</button>
        <button onClick={this.previousDay}>&lt;</button>
        <button onClick={this.toggleSimulation}>{this.state.running ? 'PAUSE' : 'PLAY'}</button>
        <button onClick={this.nextDay}>&gt;</button>
        <button onClick={this.nextWeek}>&gt;&gt;</button>
      </div>
    );
  }
}

export default SimulationController;

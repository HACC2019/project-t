import React, {Component} from 'react';
import { Button, Popup } from 'semantic-ui-react';
const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export class SimulationController extends Component {
  constructor(props) {
    super(props);

    this.state = {
        running: false
    }

    this.advanceDay = this.advanceDay.bind(this);
    this.rewindDay = this.rewindDay.bind(this);
    this.advanceWeek = this.advanceWeek.bind(this);
    this.rewindWeek = this.rewindWeek.bind(this);
    this.toggleSimulation = this.toggleSimulation.bind(this);
    this.runSimulation = this.runSimulation.bind(this);
    this.props.controller.addListener(this.render.bind(this));
  }

  advanceDay() {
    this.props.controller.advanceDay();
  }

  rewindDay() {
    this.props.controller.rewindDay();
  }

  advanceWeek() {
    this.props.controller.advanceWeek();
  }

  rewindWeek() {
    this.props.controller.rewindWeek();
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
        this.props.controller.advanceDay();
        this._timeout = setTimeout(this.runSimulation, 100);
    }

  render() {
    let date = new Date(this.props.controller.getTime());

    return (
      <div style={{ display: 'flex', flexDirection: 'row', height: '3em', background: '#111116', color: '#FFF'}}>
        <div style={{margin: 'auto 0', padding: '0 1em'}}>Week of {weekDayNames[date.getDay()]}, {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()} (week {this.props.controller.getWeekNumber()})</div>
        <div style={{flex: 1}} />
        <Button.Group>
          <Popup 
            content='Reverse 1 week' 
            trigger={
              <Button icon='fast backward' onClick={this.rewindWeek} style={{borderRadius: '0px'}}/>
            }/>
          <Popup 
            content='Reverse 1 day' 
            trigger={
              <Button icon='step backward' onClick={this.rewindDay} style={{borderRadius: '0px'}}/>
            }/>
          <Button onClick={this.toggleSimulation} style={{borderRadius: '0px'}}>
            {this.state.running ? 'PAUSE' : 'PLAY'} 
          </Button>
          <Popup 
            content='Advance 1 day' 
            trigger={
            <Button icon='step forward' onClick={this.advanceDay} style={{borderRadius: '0px'}}/>    
            }
            position='bottom right'/>
          <Popup 
            content='Advance 1 week' 
            trigger={
            <Button icon='fast forward' onClick={this.advanceWeek} style={{borderRadius: '0px'}}/>
            }
            position='bottom right'/>
        </Button.Group>
{/*
        <button onClick={this.rewindWeek}>&lt;&lt;</button>
        <button onClick={this.rewindDay}>&lt;</button>
        <button onClick={this.toggleSimulation}>{this.state.running ? 'PAUSE' : 'PLAY'}</button>
        <button onClick={this.advanceDay}>&gt;</button>
        <button onClick={this.advanceWeek}>&gt;&gt;</button>
*/}
      </div>
    );
  }
}

export default SimulationController;

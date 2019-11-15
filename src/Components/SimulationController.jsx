import React, {Component} from 'react';
import { Dropdown, Button, Popup } from 'semantic-ui-react';
import style from './simulation.css';
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
    this.timeRangeChanged = this.timeRangeChanged.bind(this);
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
    this.props.controller.advanceHour(6);
    this._timeout = setTimeout(this.runSimulation, 25);
  }

  timeRangeChanged(event, data) {
    console.log(event, data);

    this.props.analytics.setTimeRange(...data.value.split(' '));
  }

  render() {
    let date = new Date(this.props.controller.getTime());

    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', height: '3rem', background: '#111116', fontSize: '1.1em', color: '#b9bbbe'}}>
        <Button.Group>
          <Popup 
            inverted
            content='Reverse 1 week' 
            trigger={
              <Button icon='fast backward' onClick={this.rewindWeek} style={{borderRadius: '0px', background: '#2c2d31', color: '#b9bbbe'}}/>
            }/>
          <Popup 
            inverted
            content='Reverse 1 day' 
            trigger={
              <Button icon='step backward' onClick={this.rewindDay} style={{borderRadius: '0px', background: '#2c2d31', color: '#b9bbbe'}}/>
            }/>
          <Popup 
            inverted
            content='Run Simulation' 
            trigger={
            <Button icon={this.state.running ? 'pause' : 'play'} onClick={this.toggleSimulation} style={{borderRadius: '0px', background: '#2c2d31', color: '#b9bbbe'}} />
            }/>
          <Popup 
            inverted
            content='Advance 1 day' 
            trigger={
            <Button icon='step forward' onClick={this.advanceDay} style={{borderRadius: '0px', background: '#2c2d31', color: '#b9bbbe'}}/>    
            }/>
          <Popup 
            inverted
            content='Advance 1 week' 
            trigger={
            <Button icon='fast forward' onClick={this.advanceWeek} style={{borderRadius: '0px', background: '#2c2d31', color: '#b9bbbe'}}/>
            }/>
        </Button.Group>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>{weekDayNames[date.getDay()]}, {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()} {date.getHours() > 12 ? date.getHours() - 12 : date.getHours() == 0 ? 12 : date.getHours()}:{date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:{date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()} {date.getHours() < 12 || date.getHours() == 24 ? 'AM' : 'PM'}</div>
        <div style={{flex: 1}} />
        <div style={{margin: 'auto 0', paddingRight: '0.5em'}}>Data Range:</div>
        <Dropdown
          className={style.dark}
          style={{minWidth: '10em'}}
          selection
          defaultValue='hour 24 1'
          options={[{key: '1 day', text: '1 day (hourly)', value: 'hour 24 1'}, {key: '1 week', text: '1 week (hourly)', value: 'hour 168 1'}, {key: '1 month', text: '1 month (daily)', value: 'month 1 24'}, {key: '6 months', text: '6 months (weekly)', value: 'month 6 168'}, {key: '1 year', text: '1 year (weekly)', value: 'month 12 168'}, {key: '2 years', text: '2 years (weekly)', value: 'month 2 168'}, {key: 'All', text: 'All (weekly)', value: 'month 100 168'}]}
          onChange={this.timeRangeChanged}
        />
      </div>
    );
  }
}

export default SimulationController;

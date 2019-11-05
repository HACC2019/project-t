import React, {Component} from 'react';
import {render} from 'react-dom';

import sidebarStyle from '../../styles/sidebar.css';

export class StationSidebar extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            hovered: undefined,
            visible: true
        };
        
        this.handleShowHide = this.handleShowHide.bind(this);
    }

    handleShowHide() {
        this.setState({visible: !this.state.visible});
    }
    
    render() {
        let visibleStations = [];
        for (let station of this.props.stations.visible) {
            let element = <div
                key={station.ID}
                className={sidebarStyle.item}
                onMouseEnter={() => {
                    this.props.onStationHover(station.ID);
                }}
                onMouseLeave={() => {
                    this.props.onStationLeave();
                }}>
                <div className={sidebarStyle.property}>{station.Property}</div>
                <div className={sidebarStyle.city}>{station.City}</div>
            </div>;
            visibleStations.push(element);
        }
        
        let otherStations = [];
        for (let station of this.props.stations.other) {
            let element = <div
                key={station.ID}
                className={sidebarStyle.item}
                >
                <div className={sidebarStyle.property}>{station.Property}</div>
                <div className={sidebarStyle.city}>{station.City}</div>
            </div>;
            otherStations.push(element);
        }
        
        const style = {position: 'relative', transition: 'margin-left 250ms'};
        const svgStyle = {position: 'absolute', top: '50%', transform: 'translateY(-50%)', transition: 'transform 250ms'};
        
        if (!this.state.visible) {
            style.marginLeft = '-20vw';
            svgStyle.transform = 'translateY(-50%) rotate(180deg)'; 
        }
        
        return (
            <div style={style}>
                <div className={sidebarStyle.sidebar}>
                {
                    this.props.stations.visible.length > 0 ?
                        <div key='on-screen-stations'>
                            <div className={sidebarStyle.heading}>Visible Stations</div>
                            <div>{visibleStations}</div>
                        </div>
                    :
                        undefined
                }
                {
                    this.props.stations.other.length > 0 ?
                        <div key='off-screen-stations'>
                            <div className={sidebarStyle.heading}>Other Stations</div>
                            <div>{otherStations}</div>
                        </div>
                    :
                        undefined
                }
                </div>
                <div style={{position: 'absolute', top: '12px', right: '-23px', width: '23px', height: '48px', background: '#53555a', zIndex: 2, cursor: 'pointer'}} onClick={this.handleShowHide}>
                    <svg style={svgStyle} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill='#FFFFFF' d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>
                </div>
            </div>

            
        );
    }
}

export default StationSidebar;

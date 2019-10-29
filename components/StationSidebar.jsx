import React, {Component} from 'react';
import {render} from 'react-dom';

import sidebarStyle from '../styles/sidebar.css';

export class StationSidebar extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            hovered: undefined,
        };
    }

    updateStationSidebar() {
        
        let visibleElements = [];
        for (let station of offScreenStations) {
            let element = <div
                key={station.ID}
                className={sidebarStyle.item}
                >
                <div className={sidebarStyle.property}>{station.Property}</div>
                <div className={sidebarStyle.city}>{station.City}</div>
            </div>;
            visibleElements.push(element);
        }

        stationList.push(<div key='off-screen-stations'>
            <div className={sidebarStyle.heading}>Other Stations</div>
            <div>{visibleElements}</div>
        </div>);
        
        this.setState({stationList: stationList});
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
        
        return (
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
        );
    }
}

export default StationSidebar;

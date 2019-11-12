import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import style from './singlestyle.scss';
import Chart1 from "./SingleCharts/Chart1.jsx";

class DashboardStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: 'single'
        }
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.dashView}>
                    <Card.Group>
                        <Card color='red'>
                            <Card.Content>
                                <Card.Header>
                                    Station: {this.props.pickedStation}
                                    <Chart1 />
                                </Card.Header>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </div>
            </div>
        )
    }
}

export default DashboardStation;
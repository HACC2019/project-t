import React, {Component} from 'react';
import {Card, Table, TableBody, Button} from 'semantic-ui-react';
import style from './singlestyle.scss';
import Chart1 from "./SingleCharts/Chart1.jsx";
import CHARGE_STATIONS from "../../../json/chargeStations";

class DashboardStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                chargeStations: CHARGE_STATIONS
            },
            filtered: '',
        }
        this.handleClick = this.handleClick.bind(this);
        this.getStationDetails = this.getStationDetails.bind(this);
    }

    getStationDetails() {
        return this.state.data.chargeStations
            .filter(dataItem => (dataItem.ID) === (this.props.pickedStation))
            .map((item) => (
                    <Table.Row key={item}>
                        <Table.Cell>{item.Street_Address}</Table.Cell>
                        <Table.Cell>{item.Hours_Of_Operation}</Table.Cell>
                        <Table.Cell>{item.Charger_Fee}</Table.Cell>
                        <Table.Cell>{item.Charging_Standards}</Table.Cell>
                    </Table.Row>
            ))
    }

    handleClick() {
        this.props.home(true);
    }

    render() {
        const showItems = this.getStationDetails();
        return (
            <div className={style.container}>
                <div>
                    <Button onClick={this.handleClick}> Summary</Button>
                </div>
                <div className={style.dashView}>
                    <Table>
                        <TableBody>
                        {showItems}
                        </TableBody>
                    </Table>
                    <Card.Group>
                        <Card color='red'>
                            <Card.Content>
                                <Card.Header>
                                    Station: {this.props.pickedStation}
                                    <Chart1/>
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
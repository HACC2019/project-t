import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import style from './singlestyle.scss';

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
                            <Image src="https://via.placeholder.com/150" />
                            <Card.Content>
                                <Card.Header>
                                    Single Station
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
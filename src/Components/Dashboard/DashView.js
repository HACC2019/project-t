import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import style from './dashboard.scss';

export default function DashView() {
  return (
    <div className={style.container}>
      <div className={style.dashView}>
        <Card.Group>
          <Card color='red'>
            <Card.Content>  
            </Card.Content>
          </Card>
          <Card color='red'>
            <Image src="https://via.placeholder.com/150" />
            <Card.Content>  
              <Card.Header>
                Hello There 2
              </Card.Header>
            </Card.Content>
          </Card>
          <Card color='red'>
            <Image src="https://via.placeholder.com/150" />
            <Card.Content>  
              <Card.Header>
                Hello There 3
              </Card.Header>
            </Card.Content>
          </Card>
          <Card color='red'>
            <Image src="https://via.placeholder.com/150" />
            <Card.Content>  
              <Card.Header>
                Hello There 4
              </Card.Header>
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
    </div>
  )
}

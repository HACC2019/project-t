import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

export default class GraphCard extends Component {
  render() {
    return (
      <Card fluid style={{backgroundColor: '#212124', boxShadow: '0 1px 3px 0 #141414, 0 0 0 1px #141414'}}>
        <Card.Content>
          <Card.Header style={{color: '#D8D9DA'}}>
            {this.props.title}
          </Card.Header>
          <div style={{position: 'relative', height: '30vh'}}>
            {this.props.children}
          </div>
        </Card.Content>
      </Card>
    );
  }
}

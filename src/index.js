import React from 'react';
import ReactDOM from 'react-dom';
import history from './history';

import { Router, Route, Switch } from 'react-router-dom';
import './index.css';

import socketIOClient from 'socket.io-client';

// COMPONENTS
import Home from './components/home';
import Room from './components/room';

class App extends React.Component {
  state = {
    callSign: '',
    endpoint: 'ws://127.0.0.1:80',
    response: false,
    socket: null
  };

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    this.setState({ socket: socket });
  }

  navigateToRoom = (roomName, callSign) => {
    this.setState({ roomName: roomName, callSign: callSign });
    history.push('/' + roomName);
  };

  render() {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route
              path="/:room"
              component={() => (
                <Room
                  roomName={this.state.roomName}
                  callSign={this.state.callSign}
                  socket={this.state.socket}
                />
              )}
            />
            <Route
              path="/"
              component={() => (
                <Home parentCallback={this.navigateToRoom} socket={this.state.socket} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

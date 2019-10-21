import React from 'react';
import ReactDOM from 'react-dom';
import history from './history';

import { Router, Route, Switch } from 'react-router-dom';
import './index.css';

import io from 'socket.io-client';

// COMPONENTS
import Home from './components/home';
import Room from './components/room';

class App extends React.Component {
  state = {
    callSign: '',
    socket: null
  };

  componentDidMount() {
    this.initSocket();
  }

  initSocket() {
    console.log(window.location.href.startsWith('http://localhost'));
    const socket = window.location.href.startsWith('http://localhost')
      ? io('localhost:8080')
      : io();

    this.setState({ socket });
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
            />{' '}
            <Route
              path="/"
              component={() => (
                <Home parentCallback={this.navigateToRoom} socket={this.state.socket} />
              )}
            />{' '}
          </Switch>{' '}
        </div>{' '}
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

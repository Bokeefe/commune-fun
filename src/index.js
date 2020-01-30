import React from 'react';
import ReactDOM from 'react-dom';
import history from './history';

import { Router, Route, Switch } from 'react-router-dom';
import './index.css';

import io from 'socket.io-client';

// COMPONENTS
import Home from './components/home/home';
import Room from './components/room';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      socket: null,
    };
    this.initSocket.bind = this.initSocket.bind(this);
  }

  componentDidMount() {
    console.clear();
    sessionStorage.removeItem('roomName');
    if (sessionStorage.getItem('username')) { this.setState({username: sessionStorage.getItem('username')} )}
    this.initSocket();
  }

  initSocket = () => {
    const socket = window.location.href.startsWith('http://localhost')
      ? io('localhost:8080')
      : io();
    this.setState({ socket });
  };

  navigateToRoom = (roomName, username) => {
    this.setState({ roomName: roomName, username: username });
    sessionStorage.setItem('roomName', this.state.roomName);
    sessionStorage.setItem('username', this.state.username);

    history.push('/' + roomName);
  };

  render() {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route
              path='/:room'
              component={() => (
                <Room
                  roomName={this.state.roomName}
                  username={this.state.username}
                  socket={this.state.socket}
                />
              )}
            />
            <Route
              path='/'
              component={() => (
                <Home
                  parentCallback={this.navigateToRoom}
                  socket={this.state.socket}
                  restartSocket={this.initSocket}
                />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));

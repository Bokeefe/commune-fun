import React from 'react';
import history from '../history';
import { NavLink } from 'react-router-dom';
import Meme from '../games/meme/meme';
import Chat from './chat';
import RoomOrganizer from './room_organizer';

import openSocket from 'socket.io-client';

class Room extends React.Component {
  socket = null;
  constructor(props) {
    super(props);
    this.state = {
      callSign: this.props.callSign,
      game: null,
      roomName: this.props.roomName,
      messages: [],
      users: []
    };
    this.sendMsg.bind(this);
  }

  componentDidMount() {
    this.socket = openSocket('http://localhost:8080');

    const roomName = this.props.roomName
      ? this.props.roomName
      : history.location.pathname.replace('/', '');

    const callSign = this.props.callSign ? this.props.callSign : this.createCallSign();

    this.setState({ callSign: callSign, roomName: roomName }, () => {
      this.socket.emit(
        'joinRoom',
        { room: this.state.roomName, username: this.state.callSign },
        room => {
          if (!room.nameTaken) {
            this.appendMessage(room.username, room.message);
          }

          if (room.game) {
            this.setState({ game: room.game });
          }
        }
      );
    });

    this.socket.on('message', message => {
      this.appendMessage(message.username, message.text);
    });

    this.socket.on('updateGame', game => {
      console.log('got game', game);
      this.setState({ game });
    });
  }

  appendMessage(callSign, message) {
    if (this.state.messages.length > 4) {
      this.state.messages.shift();
    }
    if (message) {
      const concatMsgs = this.state.messages.concat({ callSign: callSign, message: message });
      this.setState({ messages: concatMsgs });
    }
  }

  updateGame = game => {
    this.setState({ game: game });
  };

  createCallSign() {
    // const callSign = prompt('create a callsign for the game room:');
    // if (callSign) {
    //   this.setState({ callSign: callSign });
    //   return callSign;
    // } else {
    //   history.push('/');
    //   return null;
    // }
    return 'Jimbo';
  }

  sendMsg = (callSign, message) => {
    this.socket.emit('message', {
      username: callSign,
      text: message
    });
  };

  startGame = nameOfTheGame => {
    this.socket.emit('startGame', nameOfTheGame);
  };

  socketListeners() {
    this.socket.on('updateGame', this.updateGame.bind(this));
  }

  render() {
    return (
      <div className="room">
        <div>
          <NavLink to="/">
            <span role="img" aria-label="home icon">
              🏰
            </span>
          </NavLink>
          Welcome to {this.state.roomName}
          <RoomOrganizer users={this.state.users} />
        </div>

        {/* <Meme
          game={this.state.game}
          updateGame={this.updateGame.bind(this)}
          onStartGame={this.startGame.bind(this)}
        /> */}

        <Chat
          callSign={this.state.callSign}
          messages={this.state.messages}
          onSendMsg={this.sendMsg}
        />
      </div>
    );
  }

  componentWillUnmount() {}
}

export default Room;

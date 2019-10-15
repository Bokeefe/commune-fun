import React from 'react';
import history from '../history';
import { NavLink } from 'react-router-dom';
import Meme from '../games/meme/meme';
import Chat from './chat';
import RoomOrganizer from './room_organizer';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callSign: this.props.callSign,
      game: null,
      roomName: this.props.roomName,
      messages: [],
      users: []
    };
  }

  componentDidMount() {
    const roomName = this.props.roomName
      ? this.props.roomName
      : history.location.pathname.replace('/', '');

    // const callSign = this.props.callSign ? this.props.callSign : this.createCallSign();
    const callSign = this.props.callSign ? this.props.callSign : this.createCallSign();

    this.setState({ callSign: callSign, roomName: roomName }, () => {
      socket.emit(
        'joinRoom',
        { room: this.state.roomName, username: this.state.callSign },
        room => {
          if (!room.nameTaken) {
            this.appendMessage(room.username, room.message);
          }

          if (room.game) {
            this.updateGame(room.game);
            console.log(1, room.game);
          }
        }
      );
    });

    socket.on('message', message => {
      this.appendMessage(message.username, message.text);
    });

    socket.on('updateGame', gameData => {
      console.log(2);

      this.updateGame(gameData);
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

  sendMsg(callSign, message) {
    socket.emit('message', {
      username: callSign,
      text: message
    });
  }

  render() {
    console.log(this.state.game);
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

        <Meme updateGame={this.updateGame.bind(this)} game={this.state.game} />

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

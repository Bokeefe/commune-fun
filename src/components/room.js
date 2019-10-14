import React from 'react';
import history from '../history';
import openSocket from 'socket.io-client';
import { NavLink } from 'react-router-dom';
import Meme from '../games/meme/meme';
import Chat from './chat';
import RoomOrganizer from './room_organizer';

const socket = openSocket('http://localhost:8080');

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callSign: this.props.callSign,
      game: 'nightmareUpload',
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

    this.setState({
      roomName: this.props.roomName
        ? this.props.roomName
        : history.location.pathname.replace('/', '')
    });

    this.setState({ callSign: callSign, roomName: roomName }, () => {
      socket.emit(
        'joinRoom',
        { room: this.state.roomName, username: this.state.callSign },
        room => {
          if (!room.nameTaken) {
            console.log('sdffgdghkmskdmfds', room);
            this.appendMessage(room.username, room.message);
          }
        }
      );
    });

    socket.on('updateRoom', room => {
      console.log('updateRoom', room.room.users);
      this.setState({ users: room.room.users });
    });

    socket.on('message', message => {
      this.appendMessage(message.username, message.text);
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
    return (
      <div className="room">
        <div>
          <NavLink to="/">
            <span role="img" aria-label="home icon">
              🏰
            </span>
          </NavLink>
          Welcome to {this.state.roomName} playing {this.state.game}
        </div>

        <RoomOrganizer users={this.state.users} />
        <Meme />
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

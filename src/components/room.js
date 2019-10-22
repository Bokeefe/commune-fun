import React from 'react';
import history from '../history';
import { NavLink } from 'react-router-dom';
import Chat from './chat';
import RoomOrganizer from './room_organizer';
import Meme from '../games/meme/meme';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callSign: this.props.callSign,
      roomName: this.props.roomName,
      messages: [],
      users: [],
      room: {
        users: []
      }
    };
    this.sendMsg.bind(this);
  }

  componentDidMount() {
    const roomName = this.props.roomName
      ? this.props.roomName
      : history.location.pathname.replace('/', '');

    const callSign = this.props.callSign ? this.props.callSign : this.createCallSign();

    this.setState({ callSign: callSign, roomName: roomName }, () => {
      this.props.socket.emit(
        'joinRoom',
        { room: this.state.roomName, username: this.state.callSign },
        room => {
          this.setState({ room });
        }
      );
    });
    this.socketListeners();
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

  updateRoom = room => {
    this.setState({ room: room });
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
    this.props.socket.emit('message', {
      username: callSign,
      roomName: this.state.roomName,
      text: message
    });
  };

  startGame = name => {
    const game = {
      name: name,
      roomName: this.state.roomName
    };
    this.props.socket.emit('startGame', game);
  };

  socketListeners() {
    if (!this.props.socket) {
      history.push('/');
    } else {
      this.props.socket.on('message', message => {
        this.appendMessage(message.username, message.text);
      });

      this.props.socket.on('updateRoom', room => {
        this.setState({ room });
      });
    }
  }

  render() {
    return (
      <div className="room">
        <div className="header">
          <NavLink to="/">
            <span role="img" aria-label="home icon">
              🏰
            </span>
          </NavLink>
          Welcome {this.state.roomName}
          <RoomOrganizer users={this.state.room.users} />
        </div>

        <Meme game={this.state.room.game} onStartGame={this.startGame} startGame={this.startGame} />

        <Chat
          callSign={this.state.callSign}
          messages={this.state.messages}
          onSendMsg={this.sendMsg}
        />
      </div>
    );
  }
}

export default Room;

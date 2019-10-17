import React from 'react';
import history from '../history';
import { NavLink } from 'react-router-dom';
import Chat from './chat';
import RoomOrganizer from './room_organizer';

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
          if (!room.nameTaken) {
            this.appendMessage(room.username, room.message);
          }
          if (room.game) {
            this.setState({ game: room.game });
          }
        }
      );
    });
    this.props.socket.on('message', message => {
      this.appendMessage(message.username, message.text);
    });

    this.props.socket.on('updateGame', game => {
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
    this.props.socket.emit('message', {
      username: callSign,
      text: message
    });
  };

  startGame = nameOfTheGame => {
    this.props.socket.emit('startGame', nameOfTheGame);
  };

  socketListeners() {
    this.props.socket.on('updateGame', this.updateGame.bind(this));
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

import React from 'react';
import history from '../history';
import { NavLink } from 'react-router-dom';
import RoomOrganizer from './room_organizer';
import Meme from '../games/meme/meme';
import GamePicker from './gamePicker';
import Status from '../games/meme/roleStatus';
import Chat from './chat';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      roomName: this.props.roomName,
      messages: [],
      users: [],
      room: {
        users: []
      }
    };
    this.sendMsg.bind(this);
    this.onPickChoice.bind(this);
    this.startGame.bind(this);
  }

  componentDidMount() {
    const roomName = this.props.roomName
      ? this.props.roomName
      : history.location.pathname.replace('/', '');

    const username = this.props.username ? this.props.username : history.push('/');
    this.setState({ username: username, roomName: roomName }, () => {
      this.props.socket.emit(
        'joinRoom',
        { room: this.state.roomName, username: this.state.username },
        room => {
          this.setState({ room });
        }
      );
    });
    this.socketListeners();
  }

  appendMessage(username, message) {
    if (this.state.messages.length > 2) {
      this.state.messages.shift();
    }
    if (message) {
      const concatMsgs = this.state.messages.concat({ username: username, message: message });
      this.setState({ messages: concatMsgs });
    }
  }

  updateRoom = room => {
    this.setState({ room: room });
  };

  createUserName() {
    const username = prompt('create a callsign for the game room:');
    if (username) {
      this.setState({ username: username });
      return username;
    } else {
      history.push('/');
      return null;
    }
  }

  onPickChoice = choice => {
    this.props.socket.emit('pickChoice', choice);
  };

  sendMsg = (username, message) => {
    this.props.socket.emit('message', {
      username: username,
      roomName: this.state.roomName,
      text: message
    });
  };

  startGame = name => {
    const game = {
      name: name,
      roomName: this.state.roomName
    };

    if (name) {
      this.props.socket.emit('startGame', game);
    }
  };

  socketListeners() {
    if (!this.props.socket) {
      history.push('/');
    } else {
      this.props.socket.on('endGame', () => {
        console.log('game ended');
      });

      this.props.socket.on('message', message => {
        this.appendMessage(message.username, message.text);
      });

      this.props.socket.on('updateRoom', room => {
        this.setState({ room });
      });

      this.props.socket.on('updateStatus', status => {
        this.setState({ statusMsg: status, statusKey: Math.floor(Math.random() * 1000) });
      });
    }
  }

  render() {
    return (
      <div className="room">
        <div className="header">
          <NavLink to="/">
            <span role="img" aria-label="home icon" className="btn-home">
              🏚️
            </span>
          </NavLink>

          <RoomOrganizer
            roomName={this.state.roomName}
            users={this.state.room.users}
            game={this.state.room.game}
            socket={this.props.socket}
          />

          <div onClick={() => this.startGame('cursed')}>
            <span role="img" aria-label="home icon" className="btn-home">
              🔄
            </span>
          </div>
          <hr />
        </div>

        <Status statusMsg={this.state.statusMsg} key={this.state.statusKey} />

        <div className="game-container">
          <Meme
            game={this.state.room.game}
            startGame={this.startGame}
            username={this.state.username}
            onPickChoice={this.onPickChoice}
            socket={this.props.socket}
          />
          <GamePicker game={this.state.room.game} startGame={this.startGame} />
        </div>

        <div className="chat-container">
          <Chat
            username={this.state.username}
            messages={this.state.messages}
            onSendMsg={this.sendMsg}
          />
        </div>
      </div>
    );
  }
}

export default Room;

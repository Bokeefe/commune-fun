import React from 'react';
import './home.css';

export class Home extends React.Component {
  state = {
    username: '',
    rooms: [],
    pickedRoom: '',
    connected: true
  };

  constructor(props) {
    super(props);
    this.handleNewUserName = this.handleNewUserName.bind(this);
    this.handleNewRoom = this.handleNewRoom.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.onPickRoom = this.onPickRoom.bind(this);
  }

  componentDidMount() {
    if (this.props.socket) {
      this.socketListeners();
    } else {
      console.log('mo socket home');
      this.props.restartSocket();
    }
  }

  handleNewUserName(e) {
    this.setState({ username: e.target.value });
  }

  handleNewRoom(e) {
    this.setState({ pickedRoom: e.target.value });
  }

  handleFormSubmit(e) {
    this.props.parentCallback(this.state.pickedRoom, this.state.username);
  }

  onPickRoom(e) {
    this.setState({ pickedRoom: e.target.value });
  }

  socketListeners() {
    this.props.socket.on('rooms', rooms => {
      this.setState({ rooms: [] });
      /* eslint-disable */
      for (const key in rooms) {
        if (this.state.rooms.indexOf(key) === -1) {
          const concatRooms = this.state.rooms.concat(key);
          this.setState({ rooms: concatRooms });
        }
      }
      /* eslint-enable */
    });

    this.props.socket.on('connected', isConnected => {
      this.setState({ connected: isConnected });
    });
    this.props.socket.emit('getRooms');
  }

  render() {
    return (
      <div className="home">
        <h1 className="blinker">Commmune Games</h1>

        <form>
          <select onChange={this.onPickRoom}>
            {this.state.connected ? (
              <option value="Pick existing room" key="Pick existing room">
                ▼PICK AN EXISTING ROOM
              </option>
            ) : (
              <option value="REFRESH" key="refresh">
                REFRESH browser unconnected
              </option>
            )}

            {this.state.rooms.map(room => (
              <option value={room} key={room}>
                {room}
              </option>
            ))}
          </select>

          <input
            type="text"
            onChange={this.handleNewRoom}
            placeholder="...or start a New Room Here"
          />
          <input type="text" onChange={this.handleNewUserName} placeholder="Your Call Sign" />
          <button type="button" onClick={this.handleFormSubmit}>
            JOIN ROOM
          </button>
        </form>
      </div>
    );
  }
}

export default Home;

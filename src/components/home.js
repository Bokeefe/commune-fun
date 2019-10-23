import React from 'react';
import './home.css';

export class Home extends React.Component {
  state = {
    username: '',
    rooms: [],
    pickedRoom: '',
    connected: false
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
      for (const key in rooms) {
        if (this.state.rooms.indexOf(key) === -1) {
          const concatRooms = this.state.rooms.concat(key);
          this.setState({ rooms: concatRooms });
        }
      }
    });

    this.props.socket.on('connected', isConnected => {
      this.setState({ connected: isConnected });
    });
  }

  render() {
    return (
      <div className="home">
        <form>
          <select onChange={this.onPickRoom}>
            {this.state.connected ? (
              <option value="Pick existing room" key="Pick existing room">
                ▼PICK AN EXISTING ROOM
              </option>
            ) : (
              <option value="REFRESH browser unconnected" key="refresh">
                <span role="img" aria-label="lightning bolt">
                  ⚡️
                </span>
                REFRESH{' '}
                <span role="img" aria-label="lightning bolt">
                  ⚡️
                </span>{' '}
                browser unconnected
              </option>
            )}

            {this.state.rooms.map(room => (
              <option value={room} key={room}>
                {room}
              </option>
            ))}
          </select>
          <input type="text" onChange={this.handleNewUserName} placeholder="Your Call Sign" />
          <input type="text" onChange={this.handleNewRoom} placeholder="New Room Name" />
          <button type="button" onClick={this.handleFormSubmit}>
            JOIN ROOM
          </button>
        </form>
      </div>
    );
  }
}

export default Home;

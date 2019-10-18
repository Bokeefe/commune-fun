import React from 'react';
import './home.css';

export class Home extends React.Component {
  state = {
    callSign: '',
    rooms: [],
    pickedRoom: '',
    connected: false
  };

  constructor(props) {
    super(props);
    this.handleNewCallSign = this.handleNewCallSign.bind(this);

    this.handleNewRoom = this.handleNewRoom.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.onPickRoom = this.onPickRoom.bind(this);
  }

  componentDidMount() {
    if (this.props.socket) {
      this.socketListeners();
    }
  }

  componentWillUnmount() {}

  handleNewCallSign(e) {
    this.setState({ callSign: e.target.value });
  }

  handleNewRoom(e) {
    this.setState({ pickedRoom: e.target.value });
  }

  handleFormSubmit(e) {
    this.props.parentCallback(this.state.pickedRoom, this.state.callSign);
  }

  onPickRoom(e) {
    this.setState({ pickedRoom: e.target.value });
  }

  socketListeners() {
    this.props.socket.on('rooms', rooms => {
      console.log(rooms);
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
        <span>Socket connection ?</span>
        <input type="checkbox" checked={this.state.connected} readOnly={true} />
        <form>
          <select onChange={this.onPickRoom}>
            <option value="Pick existing room" key="Pick existing room">
              ▼ PICK AN EXISTING ROOM
            </option>
            {this.state.rooms.map(room => (
              <option value={room} key={room}>
                {room}
              </option>
            ))}
          </select>
          <input type="text" onChange={this.handleNewCallSign} placeholder="Your Call Sign" />

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

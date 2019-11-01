import React from 'react';
import './room_organizer.css';

class RoomOrganizer extends React.Component {
  constructor(props) {
    super(props);
    this.checkIfVoted = this.checkIfVoted.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('updateRoom', room => {
      this.checkIfVoted();
    });
  }

  checkIfVoted(user) {
    if (this.props.game) {
      if (this.props.game.choices !== 'undefined') {
        if (user in this.props.game.choices) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  render() {
    return this.props.users.length ? (
      <div className="font-tiny">
        <div>souls haunting this room ({this.props.roomName}):</div>
        <div className="user-container">
          {this.props.users.map(user => (
            <p value={user} key={user} className={this.checkIfVoted(user) ? 'voted' : null}>
              {user}
            </p>
          ))}
        </div>
      </div>
    ) : null;
  }
}

export default RoomOrganizer;

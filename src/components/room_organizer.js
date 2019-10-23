import React from 'react';
import './room_organizer.css';

class RoomOrganizer extends React.Component {
  render() {
    return this.props.users.length && !this.props.game ? (
      <div>
        <div>souls haunting this room:</div>
        <div className="user-container">
          {this.props.users.map(user => (
            <p value={user} key={user}>
              {user}
            </p>
          ))}
        </div>
      </div>
    ) : null;
  }
}

export default RoomOrganizer;

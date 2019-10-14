import React from 'react';
import './room_organizer.css';

class RoomOrganizer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.users.length ? (
      <div>
        <div>Connect Souls:</div>
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

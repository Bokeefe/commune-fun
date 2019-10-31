import React from 'react';
import './status.css';
class Status extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="status-container">
          <p className="status">{this.props.statusMsg}</p>
        </div>
      </div>
    );
  }
}

export default Status;

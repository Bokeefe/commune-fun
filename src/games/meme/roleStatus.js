import React from 'react';

class RoleStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusMsg: `test refactor`,
      isDealer: false
    };
  }

  render() {
    return (
      <div>
        <p>{this.state.statusMsg}</p>
      </div>
    );
  }
}

export default RoleStatus;

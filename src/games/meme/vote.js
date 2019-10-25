import React from 'react';

class Vote extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.game.isFinished) {
      return <div>Game is Over</div>;
    } else {
      return null;
    }
  }
}

export default Vote;

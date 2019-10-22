import React from 'react';

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pick: null
    };
  }
  render() {
    return <div>HAND COMPONENT</div>;
  }
}

export default Hand;

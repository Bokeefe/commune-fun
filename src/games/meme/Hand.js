import React from 'react';
import './hand.css';
const bottomText = require('./bottom_text.json');

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pick: null,
      hand: null,
      index: 0
    };
  }

  componentDidMount() {
    this.props.game.users.forEach(user => {
      if (user.username === this.props.username) {
        this.setState({ hand: user.hand }, () => {
          console.log(
            this.state.hand,
            bottomText[this.state.hand[0]].quote + bottomText[this.state.hand[0]].by
          );
        });
      }
    });
  }

  render() {
    if (this.props.game) {
      return (
        <div>
          <p>Pick a caption...</p>
          <div className="toggle">
            <div>
              <span role="img" className="btn-nav">
                ◀️
              </span>
            </div>
            <div className="quote">
              <p>wadawd </p>
            </div>
            <div>
              <span role="img" className="btn-nav">
                ▶️
              </span>
            </div>
          </div>

          <button>PICK CAPTION</button>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Hand;

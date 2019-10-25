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
    this.updateIndex = this.updateIndex.bind(this);
    this.handleCaptionChoice = this.handleCaptionChoice.bind(this);
  }

  componentDidMount() {
    this.props.game.users.forEach(user => {
      if (user.username === this.props.username) {
        this.setState({ hand: user.hand });
      }
    });
  }

  handleCaptionChoice() {
    console.log('handle caption');
    const bottomTextIndex = this.state.hand[this.state.index];
    const choice = {
      username: this.props.username,
      choice: bottomText[bottomTextIndex],
      rating: 0
    };
    this.props.onPickChoice(choice);
  }

  updateIndex(numDirection) {
    const newIndex = this.state.index + numDirection;

    this.setState({ index: newIndex });
    if (newIndex > 0 && newIndex < this.state.hand.length) {
      this.setState({ index: newIndex });
    } else if (newIndex > 0) {
      this.setState({ index: 0 });
    } else {
      this.setState({ index: this.state.hand.length - 1 });
    }
  }

  render() {
    if (this.props.game) {
      return (
        <div>
          <p>Pick a caption...</p>
          <div className="toggle">
            <div
              className="zero-margin"
              onClick={() => {
                this.updateIndex(-1);
              }}
            >
              <span role="img" className="btn-nav" aria-label="backward">
                ◀️
              </span>
            </div>
            <div className="quote">
              <p>{this.state.hand ? bottomText[this.state.hand[this.state.index]].quote : null}</p>
              <button className="btn-small" onClick={this.handleCaptionChoice}>
                PICK THIS CAPTION
              </button>
            </div>
            <div
              className="zero-margin"
              onClick={() => {
                this.updateIndex(1);
              }}
            >
              <span role="img" className="btn-nav" aria-label="forward">
                ▶️
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Hand;

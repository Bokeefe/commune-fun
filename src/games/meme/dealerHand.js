import React from 'react';
import './hand.css';
const bottomText = require('./bottom_text.json');

class DealerHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pick: null,
      hand: null,
      index: 0
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.handleWinningChoice = this.handleWinningChoice.bind(this);
  }

  componentDidMount() {
    this.setState({ hand: this.props.hand });
  }

  handleWinningChoice = () => {
    const bottomTextIndex = this.state.hand[this.state.index];
    const choice = {
      username: this.props.username,
      choice: bottomTextIndex,
      rating: 0
    };

    this.props.handleWinningChoice(choice);
  };

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
    if (this.props.hand) {
      return (
        <div>
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
              <button className="btn-small" onClick={this.handleWinningChoice}>
                PICK THE WINNING CAPTION
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
export default DealerHand;

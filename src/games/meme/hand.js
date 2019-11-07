import React from 'react';
import './hand.css';
const bottomText = require('./bottom_text.json');

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.handleCaptionChoice = this.handleCaptionChoice.bind(this);
  }

  componentDidMount() {
    console.log(this.props.hand[0]);
  }

  handleCaptionChoice = () => {
    const bottomTextIndex = this.props.hand[this.state.index];
    const choice = {
      username: this.props.username,
      choice: bottomTextIndex
    };
    this.props.handleCaptionChoice(choice);
  };

  updateIndex(numDirection) {
    const newIndex = this.state.index + numDirection;

    this.setState({ index: newIndex });
    if (newIndex > 0 && newIndex < this.props.hand.length) {
      this.setState({ index: newIndex });
    } else if (newIndex > 0) {
      this.setState({ index: 0 });
    } else {
      this.setState({ index: this.props.hand.length - 1 });
    }
  }

  render() {
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
            <p>{this.props.hand ? bottomText[this.props.hand[this.state.index]].quote : null}</p>
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
  }
}

export default Hand;

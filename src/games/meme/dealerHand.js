import React from 'react';
import './hand.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
const bottomText = require('./bottom_text.json');

class dealerHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      hand: [],
      quote: ''
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.handleWinningChoice = this.handleWinningChoice.bind(this);
  }

  componentDidMount() {
    if (this.props.hand) {
      this.setState({
        hand: this.props.hand,
        quote: bottomText[this.props.hand[this.state.index]].quote
      });
    }
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
      this.setState({ index: newIndex, quote: bottomText[this.state.hand[newIndex]].quote });
    } else if (newIndex > 0) {
      this.setState({ index: 0, quote: bottomText[this.state.hand[0]].quote });
    } else {
      this.setState({
        index: this.state.hand.length - 1,
        quote: bottomText[this.state.hand.length - 1].quote
      });
    }
  }

  render() {
    if (this.props.gameStatus !== 'VOTED') {
      return null;
    }
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
              <FontAwesomeIcon icon={faChevronCircleLeft} />
            </span>
          </div>
          <div className="quote">
            <p>{this.state.quote}</p>
            <button className="btn-small" onClick={this.handleWinningChoice}>
              PICK WINNER
            </button>
          </div>

          <div
            className="zero-margin"
            onClick={() => {
              this.updateIndex(1);
            }}
          >
            <span role="img" className="btn-nav" aria-label="forward">
              <FontAwesomeIcon icon={faChevronCircleRight} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default dealerHand;

import React from 'react';
import './hand.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';

const bottomText = require('./bottom_text.json');

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      hand: [],
      quote: ''
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.handleCaptionChoice = this.handleCaptionChoice.bind(this);
  }

  componentDidMount() {
    this.setState({ hand: this.props.hand }, () => {
      this.setState({ quote: bottomText[this.state.hand[this.state.index]].quote });
    });

    if (this.props.socket) {
      this.props.socket.on('updateRoom', room => {
        room.game.users.forEach(user => this.setState({ hand: user.hand }));
      });
    }
  }

  handleCaptionChoice = () => {
    const bottomTextIndex = this.state.hand[this.state.index];
    const choice = {
      username: this.props.username,
      choice: bottomTextIndex
    };
    this.props.handleCaptionChoice(choice);
    this.setState({ hand: null });
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
    if (this.props.gameStatus === 'PLAYING') {
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
                <FontAwesomeIcon icon={faChevronCircleRight} />
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

import React from 'react';
import './meme.css';
import Img from './image';
import Hand from './playerHand';
var bottomText = require('./bottom_text.json');

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      game: { active: false }
    };

    this.content = this.content.bind(this);
    this.onPickChoice = this.onPickChoice.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaded: true, game: this.props.game });
    }, 500);
  }

  onPickChoice = choice => {
    this.props.socket.emit('pickChoice', choice);
  };

  content() {
    return (
      <div className="game-container">
        {this.props.game.active ? (
          <div>
            <Img game={this.props.game} />
            <Hand
              game={this.props.game}
              username={this.props.username}
              handleCaptionChoice={this.onPickChoice}
              socket={this.props.socket}
            />
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    return <div>{this.state.loaded ? this.content() : null}</div>;
  }
}

export default Meme;

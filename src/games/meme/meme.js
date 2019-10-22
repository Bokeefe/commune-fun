import React from 'react';
import './meme.css';
import Img from './image';
import PreGame from '../pregame';

var imgs = require('./meme_img.json');
// var quotes = require('./bottom_text.json');

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      game: null
    };

    setTimeout(() => {
      this.setState({ loaded: true, game: this.props.game });
    }, 2000);
  }

  startGame = e => {
    this.props.onStartGame(e.target.value);
  };

  content() {
    return (
      <div className="img-container">
        <Img game={this.state.game} />

        <PreGame game={this.state.game} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.loaded ? (
          this.content()
        ) : (
          <h1 className="loader">
            <span role="img" aria-label="loader">
              ⚰️
            </span>
          </h1>
        )}
      </div>
    );
  }
}

export default Meme;

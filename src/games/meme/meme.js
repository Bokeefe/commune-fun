import React from 'react';
import './meme.css';
import Img from './image';
import PreGame from '../pregame';

// var quotes = require('./bottom_text.json');

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      game: { active: false }
    };

    this.content = this.content.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaded: true, game: this.props.game });
    }, 2000);
  }

  startGame = name => {
    this.props.startGame(name);
  };

  content() {
    return (
      <div className="img-container">
        {this.props.game.active ? <Img game={this.state.game} /> : <p>no image yet</p>}

        <PreGame game={this.state.game} startGame={this.startGame} />
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

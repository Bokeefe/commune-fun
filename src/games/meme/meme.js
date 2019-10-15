import React from 'react';
import './meme.css';

// var imgs = require('./meme_img_array.json');
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
    }, 1000);
  }

  startGame = e => {
    this.props.onStartGame(e.target.value);
  };

  content() {
    return !this.state.loaded ? (
      <h1>LOADING...</h1>
    ) : (
      <div>
        <h1>{this.state.game.name}</h1>
        <img src={require(`./${this.state.game.name}/${this.state.game.imgIndex}.png`)} alt="pet" />
        <div>
          <button onClick={this.startGame} value="blessed">
            Start
          </button>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.state.loaded ? this.content() : null}</div>;
  }
}

export default Meme;

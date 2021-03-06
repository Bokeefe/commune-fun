import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBiohazard, faGamepad, faCat, faChessKnight } from '@fortawesome/free-solid-svg-icons';

const memeImgs = require('../../games/meme/meme_img.json');

class GameTiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameData: {
        cursed: {
          title: 'Cursed Images',
          desc: 'Pair the wretched image with random captions'
        },
        blessed: {
          title: 'Blessed Images',
          desc: 'Pair the wholesome image with random captions'
        },
        medieval: {
          title: 'Medieval Times',
          desc: 'Pair the medieval painting with a meme caption from our modern dystopia'
        }
      },
      pickedGame: ''
    };
    this.onPickGame = this.onPickGame.bind(this);
  }

  componentDidMount() {
    // this.getRandomImg();
  }

  getGameIcon(gameName) {
    switch (gameName) {
      case 'cursed':
        return faBiohazard;
      case 'blessed':
        return faCat;
      case 'medieval':
        return faChessKnight;
      default:
        return faGamepad;
    }
  }

  getRandomImg() {
    const randIndex = Math.floor(Math.random() * memeImgs[this.props.name].length);
    return `/imgs/${this.props.name}/${memeImgs[this.props.name][randIndex]}`;
  }

  onPickGame = game => {
    this.props.onPickGame(game);
  };

  render() {
    if (this.props.name) {
      return (
        <div
          className="game-tile"
          key={this.props.name}
          // style={{ backgroundImage: `url(${this.getRandomImg()})` }}
          onClick={() => this.onPickGame(this.props.name)}
        >
          <div className="desc">
            <FontAwesomeIcon icon={this.getGameIcon(this.props.name)} className="tile-icon" />
            <h3>{this.state.gameData[this.props.name].title}</h3>
            <p>{this.state.gameData[this.props.name].desc}</p>
          </div>
        </div>
      );
    } else {
      return (
        <h1>
          <span role="img" aria-label="coffin">
            ⚰️
          </span>
        </h1>
      );
    }
  }
}

export default GameTiles;

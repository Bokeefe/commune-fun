import React from 'react';
import GameTiles from './gameTiles/gameTiles';
import './gamePicker.css';

export class GamePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: ['blessed', 'cursed', 'medieval'],
      pickedGame: ''
    };

    this.onPickGame = this.onPickGame.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  content() {}

  checkIfGameIsActive() {
    if (this.props.game) {
      if (this.props.game.active) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  handleFormSubmit() {
    if (this.state.pickedGame) {
      this.props.startGame(this.state.pickedGame);
    } else {
      alert('pick a game or have someone else do it.');
    }
  }

  onPickGame = game => {
    this.setState({ pickedGame: game }, () => {
      this.handleFormSubmit();
    });
  };

  render() {
    return this.checkIfGameIsActive() ? null : (
      <div>
        <div className="gameTiles">
          {this.state.games.map(game => (
            <GameTiles name={game} key={game} onPickGame={this.onPickGame} />
          ))}
        </div>
      </div>
    );
  }
}

export default GamePicker;

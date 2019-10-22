import React from 'react';

export class PreGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: ['blessed', 'cursed'],
      pickedGame: ''
    };

    this.onPickGame = this.onPickGame.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  onPickGame(e) {
    this.setState({ pickedGame: e.target.value });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (this.state.pickedGame) {
      this.props.startGame(this.state.pickedGame);
    } else {
      alert('pick a game or have someone else do it.');
    }
  }

  render() {
    if (this.props.game.active) {
      return null;
    } else {
      return (
        <div>
          <h3>Once everyone has joined, someone pick a game and start</h3>

          <form>
            <select onChange={this.onPickGame}>
              <option value="Pick existing game" key="Pick existing game">
                ▼PICK A GAME
              </option>
              {this.state.games.map(game => (
                <option value={game} key={game}>
                  {game} images
                </option>
              ))}
            </select>
            <button onClick={this.handleFormSubmit}>Start Game</button>
          </form>
        </div>
      );
    }
  }
}

export default PreGame;

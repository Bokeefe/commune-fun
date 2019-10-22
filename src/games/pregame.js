import React from 'react';

export class PreGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: ['blessed', 'cursed']
    };
  }

  startGame() {}

  render() {
    if (this.props.game) {
      return null;
    } else {
      return (
        <div>
          <h3>Once everyone has joined, someone pick a game and start</h3>

          <form>
            <select onChange={this.onPickRoom}>
              <option value="Pick existing room" key="Pick existing room">
                ▼PICK A GAME
              </option>
              {this.state.games.map(room => (
                <option value={room} key={room}>
                  {room} images
                </option>
              ))}
            </select>
            <button onClick={this.startGame}>Start Game</button>
          </form>
        </div>
      );
    }
  }
}

export default PreGame;

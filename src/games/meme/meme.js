import React from 'react';
import './meme.css';
import Img from './image';
import PreGame from '../pregame';
import RoleStatus from './roleStatus';

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      game: { active: false }
    };

    this.content = this.content.bind(this);
    this.onPickChoice = this.onPickChoice.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaded: true, game: this.props.game });
    }, 1500);
  }

  onPickChoice = choice => {
    this.props.onPickChoice(choice);
  };

  startGame = name => {
    this.props.startGame(name);
  };

  content() {
    return (
      <div className="game-container">
        {this.props.game.active ? (
          <div>
            <Img game={this.props.game} />
            <RoleStatus
              game={this.props.game}
              username={this.props.username}
              onPickChoice={this.onPickChoice}
              socket={this.props.socket}
            />
          </div>
        ) : (
          <PreGame game={this.state.game} startGame={this.startGame} />
        )}
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

import React from 'react';
import './meme.css';
import Img from './image';
import Hand from './playerHand';
import DealerHand from './dealerHand';
const bottomText = require('./bottom_text.json');

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      game: { active: false },
      gameIsActive: false,
      isDealer: false,
      dealerHand: null,
      winner: null
    };

    this.content = this.content.bind(this);
    this.onPickChoice = this.onPickChoice.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaded: true, game: this.props.game });
    }, 500);

    this.props.socket.on('updateRoom', room => {
      if (room.game) {
        this.setState({ gameIsActive: room.game.active });
        if (room.game.dealer) {
          if (room.game.dealer === this.props.username) {
            this.setState({ isDealer: true });
          }
        }
      }
    });

    this.props.socket.on('dealerHand', dealerHand => this.setState({ dealerHand }));
    this.props.socket.on('winningPick', winningPick => {
      this.setState({ winner: winningPick }, () => {
        console.log(this.state.winner);
      });
    });
  }

  onPickChoice = choice => {
    this.props.socket.emit('pickChoice', choice);
  };

  onPickWinner = winner => {
    this.props.socket.emit('winningPick', winner);
  };

  content() {
    return (
      <div className="game-container">
        {this.props.game.active ? (
          <div>
            <Img game={this.props.game} />
          </div>
        ) : null}

        {this.state.winner ? (
          <h1>
            {bottomText[this.state.winner.choice].quote}{' '}
            {bottomText[this.state.winner.choice].by
              ? ' - ' + bottomText[this.state.winner.choice].by
              : null}
          </h1>
        ) : (
          <div>
            {this.props.game.active && !this.state.dealerHand ? (
              <Hand
                game={this.props.game}
                username={this.props.username}
                handleCaptionChoice={this.onPickChoice}
                socket={this.props.socket}
              />
            ) : null}

            {this.state.dealerHand ? (
              <DealerHand hand={this.state.dealerHand} handleWinningChoice={this.onPickWinner} />
            ) : null}
          </div>
        )}
      </div>
    );
  }

  render() {
    return <div>{this.state.loaded ? this.content() : null}</div>;
  }
}

export default Meme;

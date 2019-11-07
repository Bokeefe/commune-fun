import React from 'react';
import './meme.css';
import Img from './image';
import Hand from './hand';
import DealerHand from './dealerHand';
const bottomText = require('./bottom_text.json');

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      game: { active: false },
      gameIsActive: false,
      hand: [],
      handKey: 0,
      isDealer: false,
      key: 0,
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
        room.game.users.forEach(user => {
          if (user.username === this.props.username) {
            if (user.hand !== this.state.hand) {
              this.setState({ hand: user.hand });
              console.log('new hand? ', this.state.hand);
            }
          }
        });
        this.setState({ gameIsActive: room.game.active });

        if (room.game.dealer) {
          if (room.game.dealer === this.props.username) {
            this.setState({ isDealer: true });
          }
        }
      }
      this.setState({ handKey: Math.floor(Math.random() * 1000) });
    });

    this.props.socket.on('dealerHand', dealerHand => this.setState({ dealerHand }));
    this.props.socket.on('winningPick', winningPick => {
      this.setState({ winner: winningPick });
    });
  }

  getRoomName() {
    if (sessionStorage.getItem('roomName')) {
      return sessionStorage.getItem('roomName');
    }
  }

  onPickChoice = choice => {
    this.props.socket.emit('pickChoice', choice);
  };

  onPickWinner = winner => {
    this.props.socket.emit('winningPick', winner);
  };

  onPlayAgain = () => {
    this.setState({ winner: null });
    this.props.socket.emit('startGame', {
      name: this.props.game.name,
      roomName: this.getRoomName()
    });
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
          <div>
            <p className="winner">
              🏆: {bottomText[this.state.winner.choice].quote}
              {bottomText[this.state.winner.choice].by
                ? ' - ' + bottomText[this.state.winner.choice].by
                : null}
            </p>
            <button onClick={this.onPlayAgain}>PLAY AGAIN</button>
          </div>
        ) : (
          <div>
            {this.props.game.active && !this.state.dealerHand ? (
              <Hand
                hand={this.state.hand}
                key={this.state.handKey}
                username={this.props.username}
                handleCaptionChoice={this.onPickChoice}
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

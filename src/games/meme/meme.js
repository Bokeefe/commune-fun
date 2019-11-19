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
      gameStatus: 'INACTIVE',
      hand: [],
      handKey: 0,
      isDealer: false,
      key: 0,
      dealerHand: null,
      showDealerHand: false,
      winner: null
    };

    this.content = this.content.bind(this);
    this.initIoListeners = this.initIoListeners.bind(this);
    this.onPickChoice = this.onPickChoice.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaded: true, game: this.props.game });
    }, 500);
    this.initIoListeners();
  }

  getGameStatus(game) {
    if (game.active && game.isFinished && !!game.winner) {
      return 'FINISHED';
    } else if (game.active && game.isFinished && !game.winner) {
      return 'VOTED';
    } else if (game.active && !game.isFinished && !game.winner) {
      return 'PLAYING';
    } else if (!game.active && !game.isFinished && !game.winner) {
      return 'INACTIVE';
    }
  }

  getRoomName() {
    if (sessionStorage.getItem('roomName')) {
      return sessionStorage.getItem('roomName');
    }
  }

  initIoListeners() {
    this.props.socket.on('updateRoom', room => {
      if (room.game) {
        room.game.users.forEach(user => {
          if (user.username === this.props.username) {
            if (user.hand !== this.state.hand) {
              this.setState({ hand: user.hand });
              sessionStorage.setItem('room', JSON.stringify(room));
            }
          }
        });

        if (room.game.dealer) {
          if (room.game.dealer === this.props.username) {
            this.setState({ isDealer: true });
          }
        }

        this.setState({ winner: room.game.winner });
      }

      this.setState({
        handKey: Math.floor(Math.random() * 1000),
        gameStatus: this.getGameStatus(room.game)
      });
    });

    this.props.socket.on('dealerHand', dealerHand => {
      this.setState({ dealerHand });
    });

    this.props.socket.on('winningPick', winningPick => {
      this.setState({ winner: winningPick });
    });
  }

  onPickChoice = choice => {
    this.props.socket.emit('pickChoice', choice);
  };

  onPickWinner = winner => {
    this.props.socket.emit('winningPick', winner);
  };

  onPlayAgain = () => {
    this.setState(
      {
        winner: null,
        isDealer: false,
        dealerHand: null,
        hand: [],
        gameStatus: 'PLAYING'
      },
      () => {
        this.props.socket.emit('startGame', {
          name: this.props.game.name,
          roomName: this.getRoomName()
        });
      }
    );
  };

  content() {
    return (
      <div className="game-container">
        {this.props.game.active ? (
          <div>
            <Img game={this.props.game} />
          </div>
        ) : null}

        <div>
          {this.state.hand ? (
            <Hand
              gameStatus={this.state.gameStatus}
              hand={this.state.hand}
              key={this.state.handKey}
              socket={this.props.socket}
              username={this.props.username}
              handleCaptionChoice={this.onPickChoice}
            />
          ) : null}

          {this.state.isDealer &&
          this.state.winner === null &&
          this.state.gameStatus === 'VOTED' ? (
            <DealerHand
              gameStatus={this.state.gameStatus}
              hand={this.state.dealerHand}
              key={this.state.handKey + 1}
              username={this.props.username}
              handleWinningChoice={this.onPickWinner}
            />
          ) : null}
        </div>

        {this.state.winner ? (
          <div key={this.state.handKey + 2}>
            <p className="winner">
              <span role="img" aria-label="winner trophy">
                🏆
              </span>
              : {bottomText[this.state.winner.choice].quote}
              {bottomText[this.state.winner.choice].by
                ? ' - ' + bottomText[this.state.winner.choice].by
                : null}
            </p>
            <button onClick={this.onPlayAgain}>PLAY AGAIN</button>
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    return <div>{this.state.loaded ? this.content() : null}</div>;
  }
}

export default Meme;

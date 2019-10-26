import React from 'react';
import Hand from './playerHand';
import Winner from './winner';

class RoleStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusMsg: `Pick the best caption then ${this.props.game.dealer} will pick the best one`,
      isDealer: false
    };
    this.onPickChoice = this.onPickChoice.bind(this);
  }

  componentWillMount() {
    this.props.game.users.forEach(user => {
      if (user.username === this.props.username) {
        this.setState({ hand: user.hand });
      }
    });

    if (this.props.username === this.props.game.dealer) {
      this.setState({
        statusMsg: 'You are the dealer, after you pick a caption you will pick the best one',
        isDealer: true
      });
    }

    this.props.game.choices.forEach(choice => console.log(choice.username));
  }

  onPickChoice = choice => {
    console.log('meme', choice, this.props.socket);
    this.props.socket.emit('pickChoice', choice);
  };

  render() {
    return (
      <div>
        <p>{this.state.statusMsg}</p>
        {this.props.game.isFinished ? (
          <div>Waiting for the dealer ⏳</div>
        ) : (
          <Hand
            game={this.props.game}
            username={this.props.username}
            handleCaptionChoice={this.onPickChoice}
            socket={this.props.socket}
          />
        )}
      </div>
    );
  }
}

export default RoleStatus;

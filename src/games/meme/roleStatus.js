import React from 'react';

class RoleStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusMsg: `Pick the best caption then ${this.props.game.dealer} will pick the best one`
    };
  }

  componentWillMount() {
    this.props.game.users.forEach(user => {
      if (user.username === this.props.username) {
        this.setState({ hand: user.hand });
      }
    });

    if (this.props.username === this.props.game.dealer) {
      this.setState({
        statusMsg: 'You are the dealer, after you pick a caption you will pick the best one'
      });
    }

    this.props.game.choices.forEach(choice => console.log(choice.username));
  }

  render() {
    return (
      <div>
        <p>{this.state.statusMsg}</p>
      </div>
    );
  }
}

export default RoleStatus;

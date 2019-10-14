import React from 'react';
import './chat.css';
export class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.handleChatMessage = this.handleChatMessage.bind(this);
  }

  handleChatMessage(e) {
    if (e.keyCode !== 13) {
      this.setState({ message: e.target.value });
    } else {
      this.sendMsg();
    }
  }

  sendMsg = () => {
    this.props.onSendMsg(this.props.callSign, this.state.message);
    document.getElementById('message').value = '';
    this.setState({ message: '' });
  };

  render() {
    return (
      <div className="msg-container">
        <div className="messages">
          {this.props.messages.map(function(item, index) {
            return (
              <div key={index}>
                <span>
                  <b>{item.callSign}</b>: {item.message}
                </span>
              </div>
            );
          })}
        </div>
        <div>
          <input
            id="message"
            type="text"
            onKeyUp={this.handleChatMessage}
            placeholder="type here"
          />
          <button type="button" onClick={this.sendMsg}>
            chat
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;

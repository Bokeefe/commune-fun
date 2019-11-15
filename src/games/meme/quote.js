import React from 'react';
const bottomText = require('./bottom_text.json');

class Quote extends React.Component {
  constructor(props) {
    super(props);

    this.handleCaptionChoice.bind(this);
  }

  componentDidUpdate() {}
  handleCaptionChoice = () => {
    this.props.handleCaptionChoice();
  };

  render() {
    if (this.props.index) {
      return (
        <div className="quote">
          <p> {bottomText[this.props.index].quote} </p>
          <button className="btn-small" onClick={this.handleCaptionChoice}>
            PICK THIS CAPTION
          </button>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Quote;

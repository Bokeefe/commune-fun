import React from 'react';
var imgs = require('./meme_img.json');

class Img extends React.Component {
  render() {
    if (this.props.game.active) {
      return (
        <img
          src={`./imgs/${this.props.game.name}/${
            imgs[this.props.game.name][this.props.game.imgIndex]
          }`}
          alt={this.props.game.name + ' images'}
        />
      );
    } else {
      return (
        <h1>
          <span role="img" aria-label="coffin">
            ⚰️
          </span>
        </h1>
      );
    }
  }
}
export default Img;

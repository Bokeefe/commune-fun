import React from 'react';
import './meme.css';

import Img from './image';
import { updateGame } from '../../socket';
import { runInThisContext } from 'vm';

var imgs = require('./meme_img_array.json');
var quotes = require('./bottom_text.json');

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      game: null
    };

    setTimeout(() => {
      this.setState({ loaded: true, game: this.props.game });
    }, 500);
  }

  componentDidMount() {}

  content() {
    return (
      <div>
        <h1>{this.state.game.name}</h1>
        <img src={require(`./${this.state.game.name}/${this.state.game.imgIndex}.png`)} />
        <h3>bottom text</h3>
      </div>
    );
  }

  render() {
    return <div>{this.state.loaded ? this.content() : null}</div>;
  }
}

export default Meme;

import React from 'react';
import './meme.css';

var imgs = require('./meme_img_array.json');
var quotes = require('./bottom_text.json');

class Meme extends React.Component {
  constructor(props) {
    super(props);
    this.pickRandomQuote();
  }

  pickRandomImg() {
    return imgs[Math.floor(Math.random() * imgs.length)];
  }

  pickRandomQuote() {
    console.log(quotes[Math.floor(Math.random() * quotes.length)].quote);
    return quotes[Math.floor(Math.random() * quotes.length)].quote;
  }

  render() {
    return (
      <div>
        <div className="img-container">
          <img src={require('./cursed/' + this.pickRandomImg())} />
        </div>
        <div>
          <h3>{this.pickRandomQuote()}</h3>
        </div>
      </div>
    );
  }
}

export default Meme;

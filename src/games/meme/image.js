import React from 'react';
class Img extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('img props', this.props);
  }

  render() {
    return <img src={require('./blessed/2.png')} />;
  }
}
export default Img;

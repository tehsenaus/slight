import React, {Component} from 'react';

const SUIT_NAMES = {
    'D': 'diamonds',
    'H': 'hearts',
    'S': 'spades',
    'C': 'clubs'
  },
  CARD_NAMES = {
    'A': 'ace',
    'T': '10',
    'J': 'jack',
    'Q': 'queen',
    'K': 'king'
  };
  
export default class Card extends Component {
  render() {
    const {card, faceDown} = this.props,
    	[c,s] = card;

    return (
      <img {...this.props} className="card" src={"./images/cards/"
        +(faceDown ? 'back' : (
          (CARD_NAMES[c] || c)+"_of_"+SUIT_NAMES[s]
        )) +".png" } />
    );
  }
}

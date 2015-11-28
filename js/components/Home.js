import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as jquery from 'jquery';
import bootstrap from "bootstrap-webpack";
import styles from 'style!css!less!../../css/app.less';
import Card from './Card';




class Home extends Component {
  render() {
    const {handA, layA, dispatch} = this.props;
    const actions = bindActionCreators(HomeActions, dispatch);
    const done = layA.every(track => track.length === 3);

    return (
      <main>
        <h1>Slight</h1>
        <ul className="slightLay row">
          <li className="col-md-1"></li>
          { layA.map((track,i) =>
            <li className="col-md-2"
                onDragOver={ e => e.preventDefault() }
                onDrop={ e => actions.lay(e.dataTransfer.getData('card'), i) }
            >
              { track.map(card =>
                <Card card={ card } />
              ) }
              { [1,1,1].slice(track.length).map(() =>
                <div className="card placeholder"></div>
              ) }

              <p className="trickName">
                { track.length === 3 ? evalTrick(track) : track.length + '/' + 3 }
              </p>
            </li>
          ) }
          <li className="col-md-1"></li>
        </ul>

        <center>
        { handA.map(card =>
          <Card card={ card } draggable="true"
            onDragStart={ e => e.dataTransfer.setData('card', card) } />
        ) }

        { !handA.length &&
          <button className="btn btn-default" onClick={ () => actions.draw() }>
            { done ? 'Play Again' : 'Draw' }</button>
        }
        </center>

      </main>
    );
  }
}

export default connect(state => state.Sample)(Home)

const NUMBERS = {
  A: 1,
  T: 10,
  J: 11,
  Q: 12,
  K: 13
}, MAX = 12 * 13 * 14, HANDS = {
  'high card': MAX * 1,
  'pair': MAX * 2,
  'flush': MAX * 3,
  'straight': MAX * 4,
  'trips': MAX * 5,
  'straight flush': MAX * 6
};

function evalTrick(cs) {
  var suits = cs.map(([c,s]) => s),
    numbers = cs.map(([c,s]) => (NUMBERS[c] || +c)).sort((a,b) => a - b);

  if ( numbers.every(n => n === numbers[0]) ) {
    return 'trips';
  } else if ( numbers[0] === numbers[1] || numbers[1] === numbers[2] ) {
    return 'pair';
  }

  var flush = suits.every(s => s === suits[0]);
  if ( numbers[0] + 2 === numbers[2] || numbers[0] === NUMBERS.A && numbers[1] === NUMBERS.Q ) {
    return 'straight' + (flush ? ' flush' : '');
  }

  return flush ? 'flush' : 'high card';
}



// Bridge stuff...
var
  CARD_VALUES = {
    'A': 14,
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13
  };

var HCP = {
  A: 4, K: 3, Q: 2, J: 1
}

function sortHand(hand) {
  return hand.slice(0).sort(([ca,sa],[cb,sb]) => (
    sa < sb ? -1 : sa > sb ? 1 : ((CARD_VALUES[ca] || ca) - (CARD_VALUES[cb] || cb))
  ));
}
function hcp(hand) {
  return hand.reduce((v,[c,s]) => v + (HCP[c] || 0), 0);
}
function isBalanced(hand) {
  var cardsInSuits = SUITS.map(s => hand.filter( ([c,cs]) => s === cs ));
  var suitLengths = cardsInSuits.map(cs => cs.length);

  return Math.min(...suitLengths) >= 2 && suitLengths.filter(l => l <= 2).length < 2;
}
function bid(deck) {
  return hcp(deck) >= 12 ? (
      isBalanced(deck) ? '1NT' : ''
    ) : 'no bid'; 
}






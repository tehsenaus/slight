import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as HomeActions from '../actions/HomeActions';
import * as jquery from 'jquery';
import bootstrap from "bootstrap-webpack";
import styles from 'style!css!less!../../css/app.less';
import SlightLay from './SlightLay';
import Card from './Card';


class Home extends Component {
  render() {
    const {dispatch, local} = this.props;
    const actions = bindActionCreators(HomeActions, dispatch);

    const hand = this.props['hand' + local.player] || this.props.handA,
      lay = this.props['lay' + local.player] || this.props.layA,
      otherPlayer = local.player === 'A' ? 'B' : 'A',
      otherHand = this.props['hand' + otherPlayer] || this.props.handB,
      otherLay = this.props['lay' + otherPlayer] || this.props.layB;

    const done = lay.concat(otherLay).every(track => track.length === 3);

    return (
      <main>
        <h1>Slight</h1>
        <SlightLay {...{done, lay, otherLay}} onLay={ (card, i) => actions.lay(card, i, local.player) } />

        <div className="row">

          <div className="col-xs-8 opponent">
            <h3>Opponent</h3>

            <SlightLay done={done} lay={otherLay} otherLay={lay} faceDown={!done} />

            { otherHand.map((card,i) =>
              <Card faceDown="true" card={ card } key={ i }></Card>
            ) }

          </div>

          <div className="col-xs-4">

            { hand.map(card =>
              <Card card={ card } draggable="true"
                onDragStart={ e => e.dataTransfer.setData('card', card) } />
            ) }

            { local.player ? (!hand.length &&
              <button className="btn btn-default" onClick={ () => actions.draw(local.player) }>
                { done ? 'Play Again' : 'Draw' }</button>
              ) : (
                'Waiting for partner...'
              ) 
            }

          </div>
        </div>

      </main>
    );
  }
}

export default connect(state => ({...state.Sample, local: state.LocalGameState}))(Home)




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






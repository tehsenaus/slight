import React, {Component} from 'react';
import Card from './Card';

export default class SlightLay extends Component {
  render() {
    const {lay, otherLay, faceDown, onLay, done} = this.props;

    const sortedLay = done ? lay.slice(0).sort(compareTricks) : lay;
    const results = done ? otherLay.slice(0).sort(compareTricks)
      .map((otherTrick,i) => compareTricks(sortedLay[i], otherTrick) < 0) : [];

    return (
      <ul className="slightLay row">
        <li className="col-xs-1"></li>
        { sortedLay.map((track,i) =>
          <li className="col-xs-2"
              onDragOver={ e => onLay && e.preventDefault() }
              onDrop={ e => onLay(e.dataTransfer.getData('card'), i) }
          >
            { track.map(card =>
              <Card card={ card } faceDown={faceDown} />
            ) }
            { [1,1,1].slice(track.length).map(() =>
              <div className="card placeholder"></div>
            ) }

            <p className="trickName">
              { !faceDown && track.length === 3 ? evalTrick(track) : track.length + '/' + 3 }
            </p>

            { done &&
              <p className="result">
                { results[i] ? 'WIN' : 'LOSE' }
              </p>
            }
          </li>
        ) }
        <li className="col-xs-1"></li>
      </ul>
    );
  }
}

const NUMBERS = {
  A: 14,
  T: 10,
  J: 11,
  Q: 12,
  K: 13
}, TRICKS = 'straight flush,trips,straight,flush,pair,high card'.split(',');

function numberOf([c,s]) {
  return NUMBERS[c] || +c;
}

function evalTrick(cs) {
  var suits = cs.map(([c,s]) => s),
    numbers = cs.map(numberOf).sort((a,b) => a - b);

  if ( numbers.every(n => n === numbers[0]) ) {
    return 'trips';
  } else if ( numbers[0] === numbers[1] || numbers[1] === numbers[2] ) {
    return 'pair';
  }

  var flush = suits.every(s => s === suits[0]);
  if ( numbers[0] + 2 === numbers[2] || numbers[2] === NUMBERS.A && numbers[1] === 3 ) {
    return 'straight' + (flush ? ' flush' : '');
  }

  return flush ? 'flush' : 'high card';
}

function compareTricks(a, b) {
  const ta = evalTrick(a), tb = evalTrick(b);

  console.log(ta,tb);

  if ( ta !== tb ) return TRICKS.indexOf(ta) - TRICKS.indexOf(tb);

  const [hca, hcb] = [a,b].map(cs => Math.max( ...(cs.map(numberOf)) ));
  if ( hca !== hcb ) return hcb - hca;

  
}


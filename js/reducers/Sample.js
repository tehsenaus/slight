
const CARDS = "A23456789TJQK".split(''),
  SUITS = "DHSC".split(''),
  DECK = cprod(CARDS, SUITS).map(c => c.join(''));


const defaultState = {
  deck: shuffle(DECK),
  handA: [],
  handB: [],
  layA: [[],[],[],[],[]],
  layB: [[],[],[],[],[]]
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case "slight.draw":
      if ( state['hand' + action.hand].length ) return state;
      if ( state['lay' + action.hand].every(track => track.length === 3) ) {
      	state = defaultState;
      }

      var draw = state.deck.slice(0,3);
      return {...state,
      	deck: state.deck.slice(3),
      	['hand' + action.hand]: draw
      };

    case "slight.lay":
    	if ( state['lay' + action.hand][action.track].length >= 3 ) return state;

    	return {...state,
    		['hand' + action.hand]: state['hand' + action.hand].filter(c => c !== action.card),
    		['lay' + action.hand]: state['lay' + action.hand].map((track, i) => {
    			return i !== action.track ? track
    				: [...track, action.card];
    		})
    	}

    default:
      return state;
  }
}


function shuffle(o){
    o = o.slice(0);
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
function cprod() {
  return Array.prototype.reduce.call(arguments, function(a, b) {
    var ret = [];
    a.forEach(function(a) {
      b.forEach(function(b) {
        ret.push(a.concat([b]));
      });
    });
    return ret;
  }, [[]]);
}


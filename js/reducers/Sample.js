
const defaultState = {
  deck: [],
  handA: [],
  handB: [],
  layA: [[],[],[],[],[]],
  layB: [[],[],[],[],[]]
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case "game.start":
      return {...state,
        deck: action.deck
      };

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



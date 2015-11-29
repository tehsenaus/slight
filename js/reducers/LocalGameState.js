
const defaultState = {
  player: null
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case "game.start":
      return {...state,
      	player: action.player
      };

    default:
      return state;
  }
}

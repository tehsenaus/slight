
import {socket} from "../utils/socket";

function gameAction(createAction) {
	return (...args) => dispatch => {
		var action = createAction(...args);

		console.log('sending action', action);

		socket.emit('gameAction', action, () => {
			dispatch(action);
		});
	}
}

export var draw = gameAction( (hand = 'A') => {
  return {
    type: 'slight.draw',
    hand
  }
} )

export var lay = gameAction( (card, track, hand = 'A') => {
	return {
		type: 'slight.lay',
		hand,
		card,
		track
	}
} )


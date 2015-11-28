
export function draw(hand = 'A') {
  return {
    type: 'slight.draw',
    hand
  }
}

export function lay(card, track, hand = 'A') {
	return {
		type: 'slight.lay',
		hand,
		card,
		track
	}
}

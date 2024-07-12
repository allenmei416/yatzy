// Attempts to re-roll the dice
function attemptRollDice() {
    if (game.previousTurnBoxSelected) {
        game.resetTurn()
        roll()
        game.previousTurnBoxSelected = false;
    } else {
        roll()
    }
}

// Rolls the dice if they are not selected to be kept, updates the scoreboard
function roll() {
    var disableRoll = false;
    game.boxSelected = false;
    if (game.getState().turn < 3) {
        if (game.getState().turn === 2) {
            disableRoll = true;
        }
        for (let i = 0; i < 5; i++) {
            if (!game.diceSelected[i]) {
                game.diceValues[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        game.nextTurn();
    }
}


function roll() {
    game.boxSelected = false;
    if (game.getState().turn < 3) {
        if (game.getState().turn === 2) {
            const rollButton = document.getElementById('roll-dice');
            rollButton.disabled = true;
            rollButton.classList.add('disabled');
        }
        for (let i = 0; i < 5; i++) {
            if (!game.diceSelected[i]) {
                game.diceValues[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        game.nextTurn();
        displayDiceResults();
        updateScoreboard(game);
    }
}

// Displays the dice results on the screen
function displayDiceResults() {
    const state = game.getState();
    for (let i = 0; i < 5; i++) {
        const dieDiv = document.getElementById(`die-${i}`);
        dieDiv.className = 'die';
        if (state.diceSelected[i]) {
            dieDiv.classList.add('selected');
        }
        dieDiv.innerText = state.diceValues[i] || '-';
        if (state.turn != 0 && state.turn != 3) {
            dieDiv.onclick = () => {
                game.toggleDieSelection(i);
                displayDiceResults();
            };
        } else {
            dieDiv.onclick = null;
        }
    }
    document.getElementById('turn-info').innerText = `Turn: ${state.turn}`;
}
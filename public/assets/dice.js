// Function to roll the dice using the YatzyGame instance
function rollDice() {
        if (game.turn < 3) {
        for (let i = 0; i < 5; i++) {
            if (!game.diceSelected[i]) {
                game.diceValues[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        game.nextTurn();
        displayDiceResults();
    }
}

// Function to display the results and make dice clickable
function displayDiceResults() {
    const state = game.getState();
    const diceContainer = document.getElementById('roll-result');
    // Clear previous results
    diceContainer.innerHTML = ''; 

    // Update dice
    for (let i = 0; i < 5; i++) {
        const dieDiv = document.createElement('div');
        dieDiv.className = 'die';
        if (state.diceSelected[i]) {
            dieDiv.classList.add('selected');
        }
        dieDiv.innerText = state.diceValues[i] || '-';
        // Ensures not clickable on turn 0 and turn 3
        if (game.turn != 0 && game.turn != 3) {
            dieDiv.onclick = () => {
                game.toggleDieSelection(i);
                displayDiceResults();
            };
        }
        // On turn 3 we don't need to see what is selected
        if (game.turn === 3) {
            dieDiv.classList.remove('selected');
        }
        
        diceContainer.appendChild(dieDiv);
    }
    const turnDiv = document.createElement('div');
    turnDiv.innerText = `Turn: ${state.turn}`;
    diceContainer.appendChild(turnDiv);
}

// Displays the dice when the page loads
document.addEventListener("DOMContentLoaded", displayDiceResults);
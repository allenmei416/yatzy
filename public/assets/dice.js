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
        updateScoreboard()
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


function updateScoreboard() {
    const counts = {};
    for (let i = 1; i <= 6; i++) {
        counts[i] = game.diceValues.filter(x => x === i).length;
    }

    // Update scoreboard based on dice rolls
    document.querySelector('.one').innerText = counts[1] * 1 || 0;
    document.querySelector('.two').innerText = counts[2] * 2 || 0;
    document.querySelector('.three').innerText = counts[3] * 3 || 0;
    document.querySelector('.four').innerText = counts[4] * 4 || 0;
    document.querySelector('.five').innerText = counts[5] * 5 || 0;
    document.querySelector('.six').innerText = counts[6] * 6 || 0;


    // Update special categories
    const diceValues = Object.values(counts);
    const diceRolls = game.diceValues;
    // Calculate the score for Three of a Kind
    document.querySelector('.three-kind').innerText = diceValues.some(val => val >= 3) ? diceRolls.reduce((a, b) => a + b, 0) : 0;

    // Calculate the score for Four of a Kind
    document.querySelector('.four-kind').innerText = diceValues.some(val => val >= 4) ? diceRolls.reduce((a, b) => a + b, 0) : 0;

    // Calculate the score for Full House
    document.querySelector('.full-house').innerText = diceValues.includes(3) && diceValues.includes(2) ? 25 : 0;

    // Calculate the score for Small Straight
    document.querySelector('.small-straight').innerText = (counts[1] && counts[2] && counts[3] && counts[4]) || (counts[2] && counts[3] && counts[4] && counts[5]) || (counts[3] && counts[4] && counts[5] && counts[6]) ? 30 : 0;

    // Calculate the score for Large Straight
    document.querySelector('.large-straight').innerText = (counts[1] && counts[2] && counts[3] && counts[4] && counts[5]) || (counts[2] && counts[3] && counts[4] && counts[5] && counts[6]) ? 40 : 0;

    // Calculate the score for Chance
    document.querySelector('.chance').innerText = diceRolls.reduce((a, b) => a + b, 0);

    // Calculate the score for Yahtzee
    document.querySelector('.yahtzee').innerText = diceValues.includes(5) ? 50 : 0;

}


function setUpperTotal(){
    document.querySelector('.upper-total').innerText = 0;
}

function setFinalScore(){
    const finalScore = upperTotal + bonus + parseInt(document.querySelector('.three-kind').innerText) + parseInt(document.querySelector('.four-kind').innerText) + parseInt(document.querySelector('.full-house').innerText) + parseInt(document.querySelector('.small-straight').innerText) + parseInt(document.querySelector('.large-straight').innerText) + parseInt(document.querySelector('.chance').innerText) + parseInt(document.querySelector('.yahtzee').innerText);
    document.querySelector('.final-score').innerText = finalScore;
}


// Displays the dice when the page loads
document.addEventListener("DOMContentLoaded", displayDiceResults);
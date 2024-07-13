// Attempts to re-roll the dice


function attemptRollDice() {
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'attemptRollDice'
        },
        success: function(response) {
            if (response.disableRoll) {
                const rollButton = document.getElementById('roll-dice');
                rollButton.disabled = true;
                rollButton.classList.add('disabled');
            }
            if (response.turnLessThan3) {
                displayDiceResults();
                updateScoreboard();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error attemptRollDice:', error);
        }
    });
}


function toggleDieSelection(placement){
    console.log(placement)
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'toggleDieSelection',
            number: placement
        },
        success: function(response) {
            console.log("successful")
        },
        error: function(xhr, status, error) {
            console.error('Error selecting score:', error);
            $('#response').html('<p>Error selecting score via API.</p>');
        }
    });
}

function getState(callback) {
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'getState'
        },
        success: function(response) {
            if (response.gameState) {
                callback(response.gameState);
            } else {
                console.error('Error: gameState not found in response');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error getting state:', error);
            $('#response').html('<p>Error getting state via API.</p>');
        }
    });
}

// Update dice results after toggle
function displayDiceResults() {
    getState(function(gameState) {
        for (let i = 0; i < 5; i++) {
            const dieDiv = document.getElementById(`die-${i}`);
            dieDiv.className = 'die';
            if (gameState.diceSelected[i]) {
                dieDiv.classList.add('selected');
            }
            dieDiv.innerText = gameState.diceValues[i] || '-';
            if (gameState.turn !== 0 && gameState.turn !== 3) {
                dieDiv.onclick = () => {
                    toggleDieSelection(i);
                    displayDiceResults(); // Update dice results after toggle
                };
            } else {
                dieDiv.onclick = null;
            }
        }
        document.getElementById('turn-info').innerText = `Turn: ${gameState.turn}`;
    });
}

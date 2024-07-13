
function selectScore(scoreBox) {
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'selectScore',
            scoreBox: scoreBox
        },
        success: function(response) {
            if (response['disableScoreBox']) {

                scoreBoxMappings = {
                    ones: 'one',
                    twos: 'two',
                    threes: 'three',
                    fours: 'four',
                    fives: 'five',
                    sixes: 'six',
                    onePair: 'one-pair',
                    twoPairs: 'two-pair',
                    threeOfAKind: 'three-kind',
                    fourOfAKind: 'four-kind',
                    fullHouse: 'full-house',
                    smallStraight: 'small-straight',
                    largeStraight: 'large-straight',
                    chance: 'chance',
                    yahtzee: 'yahtzee'
                };
                const scoreBoxElement = document.querySelector(`.${scoreBoxMappings[scoreBox]}`);
                scoreBoxElement.classList.add('disabled');
            }
            console.log(response['enableRollDice'])
            if (response['enableRollDice']) {
                const rollDiceButton = document.getElementById('roll-dice');
                rollDiceButton.disabled = false;
                rollDiceButton.classList.remove('disabled');
            }
            updateOverallScore();
            checkGameWin()
        },
        error: function(xhr, status, error) {
            console.error('Error selecting score:', error);
            $('#response').html('<p>Error selecting score via API.</p>');
        }
    });

}

function calculateScore(box){
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'calculateScore',
            scoreBox: box
        },
        success: function(response) {
            if (response.score) {
                return response.score
            }
        },
        error: function(xhr, status, error) {
            console.error('Error selecting score:', error);
            $('#response').html('<p>Error selecting score via API.</p>');
        }
    });
}


// Updates the scoreboard after every dice roll for every combination
function updateScoreboard() {
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'updateScoreboard'
        },
        success: function(response) {
            if (response.scores) {
                var all_scores = response.scores;

                document.querySelector('.one').textContent = all_scores['ones'];
                document.querySelector('.two').textContent = all_scores['twos'];
                document.querySelector('.three').textContent = all_scores['threes'];
                document.querySelector('.four').textContent = all_scores['fours'];
                document.querySelector('.five').textContent = all_scores['fives'];
                document.querySelector('.six').textContent = all_scores['sixes'];
                document.querySelector('.one-pair').textContent = all_scores['onePair'];
                document.querySelector('.two-pair').textContent = all_scores['twoPairs'];
                document.querySelector('.three-kind').textContent = all_scores['threeOfAKind'];
                document.querySelector('.four-kind').textContent = all_scores['fourOfAKind'];
                document.querySelector('.full-house').textContent = all_scores['fullHouse'];
                document.querySelector('.small-straight').textContent = all_scores['smallStraight'];
                document.querySelector('.large-straight').textContent = all_scores['largeStraight'];
                document.querySelector('.chance').textContent = all_scores['chance'];
                document.querySelector('.yahtzee').textContent = all_scores['yahtzee'];
            }
        },
        error: function(xhr, status, error) {
            console.error('Error selecting score:', error);
            $('#response').html('<p>Error selecting score via API.</p>');
        }
    });
}


function updateOverallScore() {
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'updateOverallScore'
        },
        success: function(response) {
            if (response.finalScore) {
                document.querySelector('.final-score').textContent = response.finalScore;
            }
            if (response.upperTotal) {
                document.querySelector('.upper-total').textContent = response.upperTotal;
            }
            if (response.bonus) {
                document.querySelector('.bonus').textContent = response.bonus;
            }
        },
        error: function(xhr, status, error) {
            console.error('Error selecting score:', error);
            $('#response').html('<p>Error selecting score via API.</p>');
        }
    });
}

// Checker to see if the game has been won/finished
function checkGameWin() {
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'checkGameWin'
        },
        success: function(response) {
            if (response.gameWin) {
                if (response.finalScore){
                    showModal(response.finalScore);
                    const rollButton = document.getElementById('roll-dice');
                    rollButton.disabled = true;
                    rollButton.classList.add('disabled');
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('Error selecting score:', error);
            $('#response').html('<p>Error selecting score via API.</p>');
        }
    });
}

function showModal(finalScore) {
    const modal = document.getElementById("winModal");
    const modalText = document.getElementById("modalText");
    modalText.innerHTML = `Game won!<br>Your final score is ${finalScore}`;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("winModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("winModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
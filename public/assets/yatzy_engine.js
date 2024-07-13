// Calculates the score for each scorebox (combination) and returns the value
// function calculateScore(game, scoreBox) {
//     const selectedScore = game.selectedScores.find(score => score.scoreBox === scoreBox);
//     if (selectedScore) {
//         return selectedScore.score;
//     }

//     const dice = game.diceValues;
//     let score = 0;

//     switch (scoreBox) {
//         case 'ones':
//             score = dice.filter(die => die === 1).length * 1;
//             break;
//         case 'twos':
//             score = dice.filter(die => die === 2).length * 2;
//             break;
//         case 'threes':
//             score = dice.filter(die => die === 3).length * 3;
//             break;
//         case 'fours':
//             score = dice.filter(die => die === 4).length * 4;
//             break;
//         case 'fives':
//             score = dice.filter(die => die === 5).length * 5;
//             break;
//         case 'sixes':
//             score = dice.filter(die => die === 6).length * 6;
//             break;
//         case 'onePair':
//             score = getNOfAKindScore(dice, 2);
//             break;
//         case 'twoPairs':
//             score = getTwoPairsScore(dice);
//             break;
//         case 'threeOfAKind':
//             score = getNOfAKindScore(dice, 3);
//             break;
//         case 'fourOfAKind':
//             score = getNOfAKindScore(dice, 4);
//             break;
//         case 'fullHouse':
//             score = getFullHouseScore(dice);
//             break;
//         case 'smallStraight':
//             score = getSmallStraightScore(dice);
//             break;
//         case 'largeStraight':
//             score = getLargeStraightScore(dice);
//             break;
//         case 'chance':
//             score = dice.reduce((sum, die) => sum + die, 0);
//             break;
//         case 'yahtzee':
//             score = getNOfAKindScore(dice, 5);
//             break;
//         default:
//             score = 0;
//             break;
//     }

//     return score;
// }

// // Any number of a kind scoring
// function getNOfAKindScore(dice, n) {
//     const counts = Array(7).fill(0);
//     dice.forEach(die => counts[die]++);
//     let maxPairValue = 0;
//     for (let i = 1; i < counts.length; i++) {
//         if (counts[i] >= n) {
//             maxPairValue = i > maxPairValue ? i : maxPairValue;
//         }
//     }
//     return maxPairValue * n; 
// }

// // Two pairs scoring
// function getTwoPairsScore(dice) {
//     const counts = Array(7).fill(0);
//     dice.forEach(die => counts[die]++);
//     let pairs = [];
//     for (let i = 1; i < counts.length; i++) {
//         if (counts[i] >= 2) {
//             pairs.push(i * 2);
//         }
//     }
//     return pairs.length >= 2 ? pairs[0] + pairs[1] : 0;
// }

// // Full house scoring
// function getFullHouseScore(dice) {
//     const counts = Array(7).fill(0);
//     dice.forEach(die => counts[die]++);
    
//     let tripleValue = 0;
//     let tripleFound = false;
//     let doubleValue = 0;
//     let doubleFound = false;
    
//     counts.forEach((count, index) => {
//         if (count >= 3) {
//             tripleValue = index;
//             tripleFound = true;
//         }
//         if (count >= 2 && index !== tripleValue) {
//             doubleValue = index;
//             doubleFound = true;
//         }
//     });
    
//     return tripleFound && doubleFound ? (tripleValue * 3) + (doubleValue * 2) : 0;
// }

// // Small straight scoring
// function getSmallStraightScore(dice) {
//     const smallStraight = [1, 2, 3, 4, 5];
//     return smallStraight.every(num => dice.includes(num)) ? 15 : 0;
// }

// // Large straight scoring
// function getLargeStraightScore(dice) {
//     const largeStraight = [2, 3, 4, 5, 6];
//     return largeStraight.every(num => dice.includes(num)) ? 20 : 0;
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// In charge of the selection (keep) of a combination

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
                document.querySelector('.final-score').textContent = response.upperTotal;
            }
            if (response.bonus) {
                document.querySelector('.final-score').textContent = response.bonus;
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
                    showModal(game.finalScore);
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
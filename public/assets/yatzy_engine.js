function calculateScore(game, scoreBox) {
    const selectedScore = game.selectedScores.find(score => score.scoreBox === scoreBox);
    if (selectedScore) {
        return selectedScore.score;
    }

    const dice = game.diceValues;
    let score = 0;

    switch (scoreBox) {
        case 'ones':
            score = dice.filter(die => die === 1).length * 1;
            break;
        case 'twos':
            score = dice.filter(die => die === 2).length * 2;
            break;
        case 'threes':
            score = dice.filter(die => die === 3).length * 3;
            break;
        case 'fours':
            score = dice.filter(die => die === 4).length * 4;
            break;
        case 'fives':
            score = dice.filter(die => die === 5).length * 5;
            break;
        case 'sixes':
            score = dice.filter(die => die === 6).length * 6;
            break;
        case 'onePair':
            score = getNOfAKindScore(dice, 2);
            break;
        case 'twoPairs':
            score = getTwoPairsScore(dice);
            break;
        case 'threeOfAKind':
            score = getNOfAKindScore(dice, 3);
            break;
        case 'fourOfAKind':
            score = getNOfAKindScore(dice, 4);
            break;
        case 'fullHouse':
            score = getFullHouseScore(dice);
            break;
        case 'smallStraight':
            score = getSmallStraightScore(dice);
            break;
        case 'largeStraight':
            score = getLargeStraightScore(dice);
            break;
        case 'chance':
            score = dice.reduce((sum, die) => sum + die, 0);
            break;
        case 'yahtzee':
            score = getNOfAKindScore(dice, 5);
            break;
        default:
            score = 0;
            break;
    }

    return score;
}

function getNOfAKindScore(dice, n) {
    const counts = Array(7).fill(0);
    dice.forEach(die => counts[die]++);
    let maxPairValue = 0;
    for (let i = 1; i < counts.length; i++) {
        if (counts[i] >= n) {
            maxPairValue = i > maxPairValue ? i : maxPairValue;
        }
    }
    return maxPairValue * n; 
}

function getTwoPairsScore(dice) {
    const counts = Array(7).fill(0);
    dice.forEach(die => counts[die]++);
    let pairs = [];
    for (let i = 1; i < counts.length; i++) {
        if (counts[i] >= 2) {
            pairs.push(i * 2);
        }
    }
    return pairs.length >= 2 ? pairs[0] + pairs[1] : 0;
}

function getFullHouseScore(dice) {
    const counts = Array(7).fill(0);
    dice.forEach(die => counts[die]++);
    let threeOfAKind = false, twoOfAKind = false;
    counts.forEach(count => {
        if (count >= 3) threeOfAKind = true;
        if (count >= 2) twoOfAKind = true;
    });
    return threeOfAKind && twoOfAKind ? dice.reduce((sum, die) => sum + die, 0) : 0;
}

function getSmallStraightScore(dice) {
    const smallStraight = [1, 2, 3, 4, 5];
    return smallStraight.every(num => dice.includes(num)) ? 15 : 0;
}

function getLargeStraightScore(dice) {
    const largeStraight = [2, 3, 4, 5, 6];
    return largeStraight.every(num => dice.includes(num)) ? 20 : 0;
}

function selectScore(scoreBox) {
    if (game.getState().turn === 3) {
        console.log(`Score box "${scoreBox}" selected.`);
        
        if (game.selectedScores.some(score => score.scoreBox === scoreBox)) {
            console.log(`Score box "${scoreBox}" has already been selected.`);
            return;
        }

        const score = calculateScore(game, scoreBox);

        game.selectedScores.push({ scoreBox, score });

        const scoreBoxElement = document.querySelector(`.${game.scoreBoxMappings[scoreBox]}`);
        scoreBoxElement.classList.add('disabled');

        const rollDiceButton = document.getElementById('roll-dice');
        rollDiceButton.disabled = false;
        rollDiceButton.classList.remove('disabled');

        updateOverallScore(game);

        game.resetTurn();
    }
}

function updateScoreboard(game) {
    const scoreBoxes = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'onePair', 'twoPairs', 'threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'chance', 'yahtzee'];
    scoreBoxes.forEach(box => {
        game.scores[box] = calculateScore(game, box);
    });

    document.querySelector('.one').textContent = game.scores.ones;
    document.querySelector('.two').textContent = game.scores.twos;
    document.querySelector('.three').textContent = game.scores.threes;
    document.querySelector('.four').textContent = game.scores.fours;
    document.querySelector('.five').textContent = game.scores.fives;
    document.querySelector('.six').textContent = game.scores.sixes;
    document.querySelector('.one-pair').textContent = game.scores.onePair;
    document.querySelector('.two-pair').textContent = game.scores.twoPairs;
    document.querySelector('.three-kind').textContent = game.scores.threeOfAKind;
    document.querySelector('.four-kind').textContent = game.scores.fourOfAKind;
    document.querySelector('.full-house').textContent = game.scores.fullHouse;
    document.querySelector('.small-straight').textContent = game.scores.smallStraight;
    document.querySelector('.large-straight').textContent = game.scores.largeStraight;
    document.querySelector('.chance').textContent = game.scores.chance;
    document.querySelector('.yahtzee').textContent = game.scores.yahtzee;
}

function updateOverallScore(game) {
    const upperSectionKeys = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    const lowerSectionKeys = ['onePair', 'twoPairs', 'threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'chance', 'yahtzee'];

    let upperTotal = 0;
    upperSectionKeys.forEach(key => {
        if (game.scores[key] !== null) {
            upperTotal += game.scores[key];
        }
    });

    game.upperTotal = upperTotal;
    game.bonus = upperTotal >= 63 ? 35 : 0;

    let lowerTotal = 0;
    lowerSectionKeys.forEach(key => {
        if (game.scores[key] !== null) {
            lowerTotal += game.scores[key];
        }
    });

    game.finalScore = upperTotal + game.bonus + lowerTotal;

    document.querySelector('.final-score').textContent = game.finalScore;
    document.querySelector('.upper-total').textContent = game.upperTotal;
    document.querySelector('.bonus').textContent = game.bonus;
}
// Function that rolls 5 6-faced die
function rollDice() {

    let dice = [];

    for (let i = 0; i < 5; i++) {
        dice[i] = Math.floor(Math.random() * 6) + 1;
    }

    document.getElementById('roll-result').innerText = `You rolled: ${dice.join(', ')}`;

    return dice;
}


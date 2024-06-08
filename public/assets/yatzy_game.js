class YatzyGame {
    // Constructor
    constructor() {
        this.turn = 0;
        this.diceValues = [0, 0, 0, 0, 0];
        this.diceSelected = [false, false, false, false, false];
    }

    nextTurn() {
        // If the user hasn't rolled 3 times, increment turn #
        if (this.turn < 3) {
            this.turn++;
        }
    }

    // Toggles which die is selected for re-roll or not
    toggleDieSelection(index) {
        if (index >= 0 && index < 5) {
            this.diceSelected[index] = !this.diceSelected[index];
        }
    }

    // Returns the state of the game
    getState() {
        return {
            turn: this.turn,
            diceValues: this.diceValues,
            diceSelected: this.diceSelected
        };
    }
}

// Create a global game instance
const game = new YatzyGame();

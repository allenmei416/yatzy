// Yatzy Game containing information to run the game, scoring and dice values
class YatzyGame {
    // Constructor
    constructor() {            
        this.turn = 0;
        this.diceValues = [0, 0, 0, 0, 0];
        this.diceSelected = [false, false, false, false, false];
        this.scores = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            onePair: null,
            twoPairs: null,
            threeOfAKind: null,
            fourOfAKind: null,
            fullHouse: null,
            smallStraight: null,
            largeStraight: null,
            chance: null,
            yahtzee: null
        };
        this.scoreBoxMappings = {
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
        this.upperTotal = 0;
        this.selectedScores = [];
        this.bonus = 0;
        this.finalScore = 0;
        this.boxSelected = false;
        this.previousTurnBoxSelected = false;
    }

    // increase turn for next turn
    nextTurn() {
        if (this.turn < 3) {
            this.turn++;
        }
    }

    // set turn to 0 for new set of turns
    resetTurn() {
        this.turn = 0;
        this.diceValues = [0, 0, 0, 0, 0];
        this.diceSelected = [false, false, false, false, false];
    }

    // toggle die
    toggleDieSelection(index) {
        if (index >= 0 && index < 5) {
            this.diceSelected[index] = !this.diceSelected[index];
        }
    }
    
    // return state of game and dice
    getState() {
        return {
            turn: this.turn,
            diceValues: this.diceValues,
            diceSelected: this.diceSelected
        };
    }
}

// initialize game
const game = new YatzyGame();
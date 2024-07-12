<?php

namespace Yatzy;

class YatzyGame {
    public $turn;
    public $diceValues;
    public $diceSelected;
    public $scores;
    public $upperTotal;
    public $selectedScores;
    public $bonus;
    public $finalScore;
    public $boxSelected;
    public $previousTurnBoxSelected;

    public function __construct() {
        $this->turn = 0;
        $this->diceValues = [0, 0, 0, 0, 0];
        $this->diceSelected = [false, false, false, false, false];
        $this->scores = [
            'ones' => null,
            'twos' => null,
            'threes' => null,
            'fours' => null,
            'fives' => null,
            'sixes' => null,
            'onePair' => null,
            'twoPairs' => null,
            'threeOfAKind' => null,
            'fourOfAKind' => null,
            'fullHouse' => null,
            'smallStraight' => null,
            'largeStraight' => null,
            'chance' => null,
            'yahtzee' => null
        ];
        $this->upperTotal = 0;
        $this->selectedScores = [];
        $this->bonus = 0;
        $this->finalScore = 0;
        $this->boxSelected = false;
        $this->previousTurnBoxSelected = false;
    }

    public function nextTurn() {
        if ($this->turn < 3) {
            $this->turn++;
        }
    }

    public function resetTurn() {
        $this->turn = 0;
        $this->diceValues = [0, 0, 0, 0, 0];
        $this->diceSelected = [false, false, false, false, false];
    }

    public function toggleDieSelection($index) {
        if ($index >= 0 && $index < 5) {
            $this->diceSelected[$index] = !$this->diceSelected[$index];
        }
    }

    public function rollDice() {
        for ($i = 0; $i < count($this->diceValues); $i++) {
            if (!$this->diceSelected[$i]) {
                $this->diceValues[$i] = rand(1, 6);
            }
        }
    }

    public function getState() {
        return [
            'turn' => $this->turn,
            'diceValues' => $this->diceValues,
            'diceSelected' => $this->diceSelected
        ];
    }
}
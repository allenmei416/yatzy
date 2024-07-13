<?php

namespace Yatzy;

class Dice{
    
    public static function attemptRollDice($game) {

        $disableRoll = false;
        $turnLessThan3 = false;

        if ($game->previousTurnBoxSelected) {
            $game->resetTurn();
            $game->boxSelected = false;
            if ($game->getState()->turn < 3) {
                if ($game->getState()->turn === 2) {
                    $disableRoll = true;
                }
                for ($i = 0; $i < 5; $i++) {
                    if (!$game->diceSelected[$i]) {
                        $game->diceValues[$i] = rand(1, 6);
                    }
                }
                $game->nextTurn();
                $turnLessThan3 = true;
            }
            $game->previousTurnBoxSelected = false;
        } else {
            $game->boxSelected = false;
            if ($game->getState()->turn < 3) {
                if ($game->getState()->turn === 2) {
                    $disableRoll = true;
                }
                for ($i = 0; $i < 5; $i++) {
                    if (!$game->diceSelected[$i]) {
                        $game->diceValues[$i] = rand(1, 6);
                    }
                }
                $game->nextTurn();
                $turnLessThan3 = true;
            }
        }

        return [$disableRoll, $turnLessThan3];
    }


    public static function toggleDieSelection($game, $placement) {
        $game->toggleDieSelection($placement);
    }
}
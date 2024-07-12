<?php

namespace Yatzy;

class YatzyEngine {

    public static function calculateScore($game, $scoreBox) {
        $selectedScore = null;
        foreach ($game->selectedScores as $score) {
            if ($score->scoreBox === $scoreBox) {
                $selectedScore = $score;
                break;
            }
        }
        if ($selectedScore !== null) {
            return $selectedScore->score;
        }

        $dice = $game->diceValues;
        $score = 0;

        switch ($scoreBox) {
            case 'ones':
                $score = count(array_filter($dice, function($die) { return $die === 1; })) * 1;
                break;
            case 'twos':
                $score = count(array_filter($dice, function($die) { return $die === 2; })) * 2;
                break;
            case 'threes':
                $score = count(array_filter($dice, function($die) { return $die === 3; })) * 3;
                break;
            case 'fours':
                $score = count(array_filter($dice, function($die) { return $die === 4; })) * 4;
                break;
            case 'fives':
                $score = count(array_filter($dice, function($die) { return $die === 5; })) * 5;
                break;
            case 'sixes':
                $score = count(array_filter($dice, function($die) { return $die === 6; })) * 6;
                break;
            case 'onePair':
                $score = self::getNOfAKindScore($dice, 2);
                break;
            case 'twoPairs':
                $score = self::getTwoPairsScore($dice);
                break;
            case 'threeOfAKind':
                $score = self::getNOfAKindScore($dice, 3);
                break;
            case 'fourOfAKind':
                $score = self::getNOfAKindScore($dice, 4);
                break;
            case 'fullHouse':
                $score = self::getFullHouseScore($dice);
                break;
            case 'smallStraight':
                $score = self::getSmallStraightScore($dice);
                break;
            case 'largeStraight':
                $score = self::getLargeStraightScore($dice);
                break;
            case 'chance':
                $score = array_sum($dice);
                break;
            case 'yahtzee':
                $score = self::getNOfAKindScore($dice, 5);
                break;
            default:
                $score = 0;
                break;
        }

        return $score;
    }

    public static function getNOfAKindScore($dice, $n) {
        $counts = array_fill(1, 6, 0);
        foreach ($dice as $die) {
            $counts[$die]++;
        }
        $maxValue = 0;
        foreach ($counts as $value => $count) {
            if ($count >= $n) {
                $maxValue = max($maxValue, $value);
            }
        }
        return $maxValue * $n;
    }

    public static function getTwoPairsScore($dice) {
        $counts = array_fill(1, 6, 0);
        foreach ($dice as $die) {
            $counts[$die]++;
        }
        $pairs = [];
        foreach ($counts as $value => $count) {
            if ($count >= 2) {
                $pairs[] = $value * 2;
            }
        }
        return count($pairs) >= 2 ? $pairs[0] + $pairs[1] : 0;
    }

    public static function getFullHouseScore($dice) {
        $counts = array_fill(1, 6, 0);
        foreach ($dice as $die) {
            $counts[$die]++;
        }
        $tripleValue = 0;
        $tripleFound = false;
        $doubleValue = 0;
        $doubleFound = false;
        foreach ($counts as $value => $count) {
            if ($count >= 3) {
                $tripleValue = $value;
                $tripleFound = true;
            }
            if ($count >= 2 && $value !== $tripleValue) {
                $doubleValue = $value;
                $doubleFound = true;
            }
        }
        return $tripleFound && $doubleFound ? ($tripleValue * 3) + ($doubleValue * 2) : 0;
    }

    public static function getSmallStraightScore($dice) {
        $smallStraight = [1, 2, 3, 4, 5];
        return count(array_intersect($dice, $smallStraight)) === 5 ? 15 : 0;
    }

    public static function getLargeStraightScore($dice) {
        $largeStraight = [2, 3, 4, 5, 6];
        return count(array_intersect($dice, $largeStraight)) === 5 ? 20 : 0;
    }


    function selectScore($game, $scoreBox) {
        $disableScoreBox = true;
        $enableRollDice = false;
    
        if ($game->turn > 0) {
            if (!$game->boxSelected) {
                // Calculate score
                $score = calculateScore($game, $scoreBox);
    
                // Store selected score
                $game->selectedScores[] = ['scoreBox' => $scoreBox, 'score' => $score];
    
                $disableScoreBox = true;
                $enableRollDice = false;
    
                // Update overall score
                updateOverallScore($game);
    
                $game->boxSelected = true;
                $game->previousTurnBoxSelected = true;
            }
            checkGameWin($game);
        }
    
        // Return values (PHP can't return multiple values directly like JavaScript)
        return [$disableScoreBox, $enableRollDice];
    }

    function updateOverallScore($game) {
        $upperSectionKeys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
        $lowerSectionKeys = ['onePair', 'twoPairs', 'threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'chance', 'yahtzee'];
    
        $upperTotal = 0;
        $lowerTotal = 0;
    
        foreach ($game->selectedScores as $element) {
            if (in_array($element->scoreBox, $upperSectionKeys)) {
                $upperTotal += $element->score;
            } else {
                $lowerTotal += $element->score;
            }
        }
    
        $game->upperTotal = $upperTotal;
        $game->bonus = $upperTotal >= 63 ? 35 : 0;
        $game->finalScore = $upperTotal + $game->bonus + $lowerTotal;
    
        return [
            'finalScore' => $game->finalScore,
            'upperTotal' => $game->upperTotal,
            'bonus' => $game->bonus
        ];
    }

    function checkGameWin($game) {
        $gameWin = false;
        $upperSectionKeys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
        $lowerSectionKeys = ['onePair', 'twoPairs', 'threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'chance', 'yahtzee'];

        $selectedScoresLength = count($game->selectedScores);

        if ($selectedScoresLength === (count($upperSectionKeys) + count($lowerSectionKeys))) {
            $gameWin = true;
        }

        return [
            'gameWin' => $gameWin,
            'finalScore' => $game->finalScore
        ];
    }


}




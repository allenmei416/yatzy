<?php

namespace Yatzy;

class Dice {
    public function roll() {
        return rand(1, 6);
    }
}
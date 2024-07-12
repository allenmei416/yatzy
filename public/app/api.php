<?php
// Include config file
include '_config.php'; // Adjust the path as needed

use Yatzy\Dice;
use Yatzy\YatzyGame;

header('Content-Type: application/json');

session_start();


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if action is provided
    if (isset($_POST['action']) && $_POST['action'] === 'initialize') {
        // Initialize or resume game state
        if (!isset($_SESSION['yatzyGame'])) {
            $_SESSION['yatzyGame'] = new YatzyGame();
            $gameCreated = true;
        } else {
            $gameCreated = false;
        }

        $game = $_SESSION['yatzyGame'];

        // Save game state
        $_SESSION['yatzyGame'] = $game;

        echo json_encode([
            'gameState' => $game->getState(),
            'gameCreated' => $gameCreated
        ]);
        exit();
    } else {
        echo json_encode(['error' => 'Invalid action']);
        exit();
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
    exit();
}
?>
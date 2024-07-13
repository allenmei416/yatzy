<?php

// Include config file and necessary classes
include '_config.php'; // Adjust the path as needed
include 'models/Dice.php';


use Yatzy\Dice;
use Yatzy\YatzyGame;
use Yatzy\YatzyEngine;

header('Content-Type: application/json');

session_start();

// Function to handle POST request for initializing or resuming game state
function initializeGame() {
    
    $_SESSION['yatzyGame'] = new YatzyGame();
    
    $game = $_SESSION['yatzyGame'];

    // Save game state
    $_SESSION['yatzyGame'] = $game;

    // Return JSON response
    echo json_encode([
        'gameState' => $game->getState()
    ]);
    exit();
}

// Function to handle POST request for selecting a score
function selectScore() {
    // Get game object from session
    $game = $_SESSION['yatzyGame'];

    // Call selectScore function

    list($disableScoreBox, $enableRollDice) = YatzyEngine::selectScore($game, $_POST['scoreBox']);


    // Save updated game object back to session
    $_SESSION['yatzyGame'] = $game;

    // Prepare response
    $response = [
        'disableScoreBox' => $disableScoreBox,
        'enableRollDice' => $enableRollDice,
        'gameState' => $game->getState() // Optionally return game state
    ];

    // Send JSON response
    echo json_encode($response);
    exit();
}

function calculateScore(){
    if (!isset($_POST['scoreBox'])) {
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Score box not specified']);
        exit();
    }

    // Ensure game object exists in session
    if (!isset($_SESSION['yatzyGame'])) {
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Game not initialized']);
        exit();
    }
    
    // Get game object from session
    $game = $_SESSION['yatzyGame'];

    // Call selectScore function
    $score = YatzyEngine::calculateScore($game, $_POST['scoreBox']);

    // Save updated game object back to session
    $_SESSION['yatzyGame'] = $game;

    // Prepare response
    $response = [
        'score' => $score,
        'gameState' => $game->getState()
    ];

    // Send JSON response
    echo json_encode($response);
    exit();
}

function updateOverallScore(){
    
    // Get game object from session
    $game = $_SESSION['yatzyGame'];

    // Call selectScore function
    list($finalScore, $upperTotal, $bonus) = YatzyEngine::updateOverallScore($game);

    // Save updated game object back to session
    $_SESSION['yatzyGame'] = $game;

    // Prepare response
    $response = [
        'finalScore' => $finalScore,
        'upperTotal' => $upperTotal,
        'bonus' => $bonus,
        'gameState' => $game->getState()
    ];

    // Send JSON response
    echo json_encode($response);
    exit();
}

function checkGameWin(){
     // Ensure game object exists in session
     if (!isset($_SESSION['yatzyGame'])) {
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Game not initialized']);
        exit();
    }

    // Get game object from session
    $game = $_SESSION['yatzyGame'];

    // Call selectScore function
    list($gameWin, $finalScore) = checkGameWin($game);

    // Save updated game object back to session
    $_SESSION['yatzyGame'] = $game;

    // Prepare response
    $response = [
        'gameWin' => $gameWin,
        'finalScore' => $finalScore,
        'gameState' => $game->getState()
    ];

    // Send JSON response
    echo json_encode($response);
    exit();
}

function attemptRollDice() {

    // Get game object from session
    $game = $_SESSION['yatzyGame'];
    

    // Call attemptRollDice function from Dice.php
    list($disableRoll, $turnLessThan3) = Dice::attemptRollDice($game);


    // Save updated game object back to session
    $_SESSION['yatzyGame'] = $game;

    // Prepare response
    $response = [
        'disableRoll' => $disableRoll,
        'turnLessThan3' => $turnLessThan3,
        'gameState' => $game->getState()
    ];

    // Send JSON response
    echo json_encode($response);
    exit();
}


function getState(){
    $game = $_SESSION['yatzyGame'];
    $response = [
        'gameState' => $game->getState()
    ];

    // Send JSON response
    echo json_encode($response);
    exit();
}

function toggleDieSelection(){
    
    // Get game object from session
    $game = $_SESSION['yatzyGame'];

    // Save updated game object back to session
    $_SESSION['yatzyGame'] = $game;

    Dice::toggleDieSelection($game, $_POST['number']);

    // Prepare response
    $response = [
        'gameState' => $game->getState()
    ];

    // Send JSON response
    echo json_encode($response);
    exit();

}

function updateScoreboard(){
    // Ensure game object exists in session
    if (!isset($_SESSION['yatzyGame'])) {
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Game not initialized']);
        exit();
    }
    
    // Get game object from session
    $game = $_SESSION['yatzyGame'];

    
    $scores = YatzyEngine::updateScoreboard($game);

    // Save updated game object back to session
    $_SESSION['yatzyGame'] = $game;

    // Prepare response
    $response = [
        'scores' => $scores
    ];

    // Send JSON response
    echo json_encode($response);
    exit();
}

// Main entry point
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if action is provided
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'initialize':
                initializeGame();
                break;
            case 'selectScore':
                selectScore();
                break;
            case 'calculateScore':
                calculateScore();
                break;
            case 'updateOverallScore':
                updateOverallScore();
                break;
            case 'checkGameWin':
                checkGameWin();
                break;
            case 'attemptRollDice':
                attemptRollDice();
                break;
            case 'getState':
                getState();
                break;
            case 'toggleDieSelection':
                toggleDieSelection();
                break;
            case 'updateScoreboard':
                updateScoreboard();
                break;
            default:
                http_response_code(400); // Bad request
                echo json_encode(['error' => 'Invalid action']);
                exit();
        }
    } else {
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Action not specified']);
        exit();
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST method allowed']);
    exit();
}



if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if action is provided
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'calculateScore':
                calculateScore();
                break;
            default:
                http_response_code(400); // Bad request
                echo json_encode(['error' => 'Invalid action']);
                exit();
        }
    } else {
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Action not specified']);
        exit();
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST method allowed']);
    exit();
}


?>

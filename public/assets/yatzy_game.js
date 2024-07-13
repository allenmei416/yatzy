$(document).ready(function() {
    // Initialize a new game on page load
    $.ajax({
        url: 'app/api.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'initialize'
        },
        success: function(response) {
            console.log('Game initialized:', response);
            $('#response').html('<p>Game initialized. Dice: ' + response.gameState.diceValues.join(', ') + '</p>');
        },
        error: function(xhr, status, error) {
            console.error('Error initializing game:', error);
            $('#response').html('<p>Error initializing game via API.</p>');
        }
    });
});






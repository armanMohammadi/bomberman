/**
 * Created by jun on 3/10/16.
 */

$(document).ready(function(){
    var $modal = $('.modal');
    var $game = $('.game');
    var $button = $('.start-button');
    $game.hide();
    $button.click(function () {
        console.log('kossher');
        $modal.hide();
        $game.show();
        run_game();
    });
});


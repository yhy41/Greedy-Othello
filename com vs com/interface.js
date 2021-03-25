$(document).ready(function(){
  console.log("initialize UI");

  if (!GAME.players.player1.on) {
    $("#control-p1").addClass("off");
  }

  if (!GAME.players.player2.on) {
    $("#control-p2").addClass("off");
  }

  $(".switch").on("click", OthelloUI.switchHandler)

});

var OthelloUI = OthelloUI ||
{
  switchHandler: function(e) {
    var $dt = $(e.delegateTarget);
    var id = $dt.attr("id");
    var off = false;

    switch (id) {
      case "control-p1":
        if (playerCheck("player1")) {
          off = true;
        }
        break;
      case "control-p2":
        if (playerCheck("player2")) {
          off = true;
        }
        break;
      default:
        break;
    }
    function playerCheck(which) {
      if (GAME.players[which].ai) {
        GAME.players[which].ai = false;
        return true;
      } else {
        GAME.players[which].ai = true;
        if (GAME.player == which) {
          GAME.computerMove();
        }
        return false;
      }
    }

  	if (off) {
  
  		$dt.addClass('off');
  	} else {
  
  		$dt.removeClass('off');
  	}
  },


}

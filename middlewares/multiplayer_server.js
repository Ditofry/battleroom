var scheme   = "ws://"; // No persistence == no security needed... for now
var uri      = scheme + window.document.location.host + "/";
var ws       = new WebSocket(uri);

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  if ( data.action == 'playerJoined' ) {
    ig.game.spawnEntity(EntityCombatant,50,50);
  }
};

var networkAction = {

}

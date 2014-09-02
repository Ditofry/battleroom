var scheme   = "ws://"; // No persistence == no security needed... for now
var uri      = scheme + window.document.location.host + "/";
var ws       = new WebSocket(uri);
var netPlayers = {};
// var localPlayer = ig.game.getEntitiesByType('Human')[0].playerId;
var localPlayer = null;

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);

  // Add netplayers
  if ( data.action == 'playerJoined' ) {
    if ( data.data.playerId == localPlayer ) { return; }
    entity = ig.game.spawnEntity(EntityCombatant,50,50, {playerId: data.data.playerId});
    netPlayers[data.data.playerId] = entity;
  } else {
    // Invoke the paired method
    netPlayers[data.playerId][data.action]();
  }

};

var networkAction = {

}

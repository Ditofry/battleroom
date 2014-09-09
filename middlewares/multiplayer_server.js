var scheme   = "ws://"; // No persistence == no security needed... for now
var uri      = scheme + window.document.location.host + "/";
var ws       = new WebSocket(uri);
var netPlayers = {};
var localPlayer = null;

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);

  // Add netplayers
  if ( data.action == 'playerJoined' ) {
    // If local player is doing the joining
    if ( data.playerId == localPlayer ) {
      // Contact pre-existing players
      ws.send(JSON.stringify({action: 'reconoiter', netPlayer: localPlayer }));
    } else {
      entity = ig.game.spawnEntity(EntityCombatant,50,50, {playerId: data.playerId});
      netPlayers[data.playerId] = entity;
    }
  }

  if ( data.action == 'reconoiter' ) {
    // Would be nice if we could send to all BUT sender...
    if ( data.netPlayer !== localPlayer ) {
      var human = ig.game.getEntityByName('bee'),
          posx = human.pos.x,
          posy = human.pos.y;
      ws.send(JSON.stringify({action: 'handshake', playerId: localPlayer, posx: posx, posy: posy }));
    }
  }

  if ( data.action == 'handshake' ) {
    if ( data.playerId !== localPlayer ) {
      entity = ig.game.spawnEntity(EntityCombatant, data.posx, data.posy, {playerId: data.playerId});
      netPlayers[data.playerId] = entity;
    }
  }

  if ( data.action == 'playerLeft' ) {
    netPlayers[data.playerId].kill();
  }

  // UGLYUGLYUGLY just for now
  if ( data.action !== 'handshake' && data.action !== 'reconoiter' && data.action !== 'playerJoined' && data.action !== 'playerLeft' ) {
    // Invoke the paired method
    if ( netPlayers[data.playerId] ) {
      netPlayers[data.playerId][data.action]();
    }
  }

};

var networkAction = {

}

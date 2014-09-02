var scheme   = "ws://"; // No persistence == no security needed... for now
var uri      = scheme + window.document.location.host + "/";
var ws       = new WebSocket(uri);

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  console.log(message);
  console.log(data);
  if ( data.action == 'playerJoined' ) {
    console.log('hey');
    console.log(ig.game.entities);
    ig.game.spawnEntity(EntityFrankie,50,50, {human:false});
  }
};

var networkAction = {

}

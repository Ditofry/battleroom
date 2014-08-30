var scheme   = "ws://"; // Production would be wss://
var uri      = scheme + window.document.location.host + "/";
var ws       = new WebSocket(uri);
ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  console.log(data);
  console.log(data.data);
};

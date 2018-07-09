// Setup websocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8081});

// Setup broadcast
module.exports = {
  send: function(data){
    wss.clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN){
        client.send(data);
      }
    });
  },
  server: wss
}

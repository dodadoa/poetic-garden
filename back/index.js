import { Server } from 'node-osc';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const oscServer = new Server(49163, '192.168.1.38', () => {
  console.log('OSC Server is listening');
});

wss.on('connection', function connection(ws) {
  console.log('Websocket Server is listening')

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  oscServer.on('message', function (msg, sender) {
    console.log(`Message: ${msg} ${sender.address}:${sender.port}`);
    ws.send(`Message: ${msg}`);
  });

  ws.send('something');
});


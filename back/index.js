import { Server } from 'node-osc';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const oscServer = new Server(3333, '0.0.0.0', () => {
  console.log('OSC Server is listening');
});

wss.on('connection', function connection(ws) {
  console.log('Websocket Server is listening')

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  oscServer.on('message', function (msg) {
    console.log(`Message: ${msg}`);
    ws.send(`Message: ${msg}`);
    oscServer.close();
  });

  ws.send('something');
});


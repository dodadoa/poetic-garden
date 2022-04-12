import { Server } from 'node-osc';
import { WebSocketServer } from 'ws';

const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8080
const OSC_SERVER_HOST = process.env.OSS_SERVER_HOST || '127.0.0.1'
const OSC_SERVER_PORT = process.env.OSC_SERVER_PORT || 3333


const wss = new WebSocketServer({ port: WEBSOCKET_PORT });
const oscServer = new Server(OSC_SERVER_PORT, OSC_SERVER_HOST, () => {
  console.log(`OSC Server is listening on ${OSC_SERVER_HOST}:${OSC_SERVER_PORT}`);
});

wss.on('connection', function connection(ws) {
  console.log(`Websocket Server is listening on port:${WEBSOCKET_PORT}`)
  ws.send('Connected')

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  oscServer.on('message', function (msg, sender) {
    console.log(`Message: ${msg}. FROM: ${sender.address}:${sender.port}`);
    ws.send(`${msg}`);
  });

});


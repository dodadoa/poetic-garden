import { Client } from 'node-osc';

const client = new Client(process.env.CLIENT_IP, 3333)
client.send('/oscMessage', Math.random(), () => {
  client.close()
})

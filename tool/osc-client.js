import { Client } from 'node-osc';

const client = new Client('172.22.106.111', 3333)
client.send('/testing', "hi", () => {
  client.close()
})

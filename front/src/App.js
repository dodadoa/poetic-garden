import { useEffect, useState } from 'react'
import Editor from './Editor'
import './App.css'
import osc from 'osc/dist/osc-browser.min.js'

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    const oscPort = new osc.WebSocketPort({
      url: "ws://localhost:8080",
      metadata: true
    });
    oscPort.open()
    oscPort.on("message", function (oscMsg) {
      console.log(oscMsg)
      setMessage(oscMsg.args[0].value)
    });
  }, [])

  return (
    <div className="App">
      {message}
      <Editor />
    </div>
  );
}

export default App;

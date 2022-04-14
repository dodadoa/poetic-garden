import { useEffect, useState } from 'react'
import osc from 'osc/dist/osc-browser.min.js'

import Editor from './Editor/Editor'
import Canvas3d from './Canvas3d'
import './App.css'

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
      <Canvas3d />
      <Editor />
    </div>
  );
}

export default App;

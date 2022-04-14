import { useEffect, useState } from 'react'
import osc from 'osc/dist/osc-browser.min.js'

import Editor from './Editor/Editor'
import Canvas3d from './Canvas3d'
import './App.css'

function App() {
  const [oscStatus, setOscStatus] = useState("")

  useEffect(() => {
    const oscPort = new osc.WebSocketPort({
      url: "ws://localhost:8080",
      metadata: true
    });
    oscPort.open()
    oscPort.on("message", function (oscMsg) {
      console.log(oscMsg)
      setOscStatus(oscMsg.args[0].value)
    });
  }, [])

  return (
    <div className="App">
      <p style={{ position: "fixed", top: '0px', left: '10px', color: "#45542f" }}>{oscStatus}</p>
      <Canvas3d />
      <Editor />
    </div>
  );
}

export default App;

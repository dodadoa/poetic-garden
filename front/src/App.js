import { useEffect, useState } from 'react'
import osc from 'osc/dist/osc-browser.min.js'

import Editor from './Editor/Editor'
import Canvas3d from './Canvas3d'
import P5Canvas from './P5Canvas'
import './App.css'

function App() {
  const [oscMessage, setOscMessage] = useState("")

  useEffect(() => {
    const oscPort = new osc.WebSocketPort({
      url: "ws://localhost:8080",
      metadata: true
    });
    oscPort.open()
    oscPort.on("message", function (oscMsg) {
      console.log(oscMsg)
      setOscMessage(oscMsg.args[0].value)
    });
  }, [])

  return (
    <div className="App">
      <p style={{ position: "fixed", top: '0px', left: '10px', color: "#45542f" }}>{oscMessage}</p>
      <P5Canvas oscValue={oscMessage} />
      <Canvas3d oscValue={oscMessage} />
      <Editor />
    </div>
  );
}

export default App;

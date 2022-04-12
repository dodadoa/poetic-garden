import { useEffect } from 'react'
import './App.css'
import osc from 'osc/dist/osc-browser.min.js'

function App() {

  useEffect(() => {
    const oscPort = new osc.WebSocketPort({
      url: "ws://localhost:8080",
      metadata: true
    });
    oscPort.open()
    oscPort.on("message", function (oscMsg) {
      console.log(oscMsg)
      console.log("An OSC message just arrived!");
    });
  }, [])

  return (
    <div className="App">
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import osc from 'osc/dist/osc-browser.min.js'
import RiTa from 'rita'
import ml5 from 'ml5'

import Editor from './Editor/Editor'
import Canvas3d from './3d/Canvas3d'
import P5Canvas from './2d/P5Canvas'
import './App.css'

function App() {
  const [oscMessage, setOscMessage] = useState("")
  const [sentimentModel, setSentimentModel] = useState(null)
  const [sentimentScore, setSentimentScore] = useState(0.0)

  useEffect(() => {
    const loadMl5 = async () => {
      const sentiment = await ml5.sentiment('movieReviews', modelReady);
      setSentimentModel(sentiment)
    }

    loadMl5()
  }, [])

  // useEffect(() => {
  //   window.addEventListener()
  // }, [])

  const modelReady = () => {
    console.log('model ready')
  }

  const handleChange = (text) => {
    const analyzed = RiTa.analyze(text);
    const prediction = sentimentModel.predict(text)
    setSentimentScore(prediction.score)
    console.log(analyzed, prediction.score)
  }

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
      <p style={{ position: "fixed", top: '20px', left: '10px', color: "#45542f" }}>{sentimentScore}</p>
      <P5Canvas oscValue={oscMessage} sentimentScore={sentimentScore} />
      <Canvas3d oscValue={oscMessage} />
      <Editor handleChange={handleChange} />
    </div>
  );
}

export default App;

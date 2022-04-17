import React, { useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import osc from 'osc/dist/osc-browser.min.js'
import RiTa from 'rita'
import ml5 from 'ml5'

import Editor from './Editor/Editor'
import Canvas3d from './3d/Canvas3d'
import P5Canvas from './2d/P5Canvas'
import './App.css'

const OPTIONS_KEYS = ['Alt'];


function App() {
  const [oscMessage, setOscMessage] = useState("")
  const [sentimentModel, setSentimentModel] = useState(null)
  const [sentimentScore, setSentimentScore] = useState(0.0)
  const [code, setCode] = useState("")

  function nextWord() {
    let words = RiTa.tokenize(code);
    let r = Math.floor(Math.random() * words.length);
    console.log(r, words)
    for (let i = r; i < words.length + r; i++) {

      let idx = i % words.length;
      let word = words[idx].toLowerCase();
      if (word.length < 3) continue;

      let pos = RiTa.tagger.allTags(word)[0];
      let rhymes = RiTa.rhymes(word, { pos });
      let sounds = RiTa.soundsLike(word, { pos });
      let spells = RiTa.spellsLike(word, { pos });
      let similars = [...rhymes, ...sounds, ...spells];

      if (similars.length < 2) {
        console.log("No sims for " + word);
        continue;
      }

      let next = RiTa.random(similars);

      if (next.includes(word) || word.includes(next)) {
        continue;
      }
      if (/[A-Z]/.test(words[idx][0])) {
        next = RiTa.capitalize(next);
      }

      console.log("replace(" + idx + "): " + word + " -> " + next);

      words[idx] = next;
      break;
    }

    setCode(RiTa.untokenize(words))
  }

  useEffect(() => {
    const loadMl5 = async () => {
      const sentiment = await ml5.sentiment('movieReviews', modelReady);
      setSentimentModel(sentiment)
    }

    loadMl5()
  }, [])


  const modelReady = () => {
    console.log('model ready')
  }

  const handleChange = (text) => {
    // const analyzed = RiTa.analyze(text);
    const prediction = sentimentModel.predict(text)
    setSentimentScore(prediction.score)
    setCode(text)
  }

  function handler({ key }) {
    if (OPTIONS_KEYS.includes(String(key))) {
      console.log('Option key pressed!');
      nextWord()
    }
  }

  useEventListener('keydown', handler);

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
      <Editor handleChange={handleChange} code={code} />
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'
import RiTa from 'rita'
import ml5 from 'ml5'
import * as Tone from 'tone'

import Canvas3d from './3d/Canvas3d'
import P5Canvas from './2d/P5Canvas'
import './App.css'

const OPTIONS_KEYS = ['Alt'];

const reverb = new Tone.Reverb({
  decay: 10,
  wet: 0.8,
  preDelay: 0.01
}).toDestination();

const synth = new Tone.AMSynth().connect(reverb).toDestination();

const App = () => {
  const [sentimentModel, setSentimentModel] = useState(null)
  const [sentimentScore, setSentimentScore] = useState(0.0)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(true)

  const nextWord = () => {
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
      const sentiment = await ml5.sentiment('movieReviews', () => console.log('modelReady'));
      setSentimentModel(sentiment)
      setLoading(false)
    }

    loadMl5()
  }, [])

  const handleChange = (text) => {
    const analyzed = RiTa.analyze(text);
    const prediction = sentimentModel.predict(text)
    setSentimentScore(prediction.score)
    setCode(text)

    const stresses = analyzed.stresses.split(" ").filter(stress => stress !== "")
    console.log(stresses)   
  }

  const handler = ({ key }) => {
    if (OPTIONS_KEYS.includes(String(key))) {
      console.log('Option key pressed!');
      nextWord()
    }

    console.log(key)
    if (key === 'Spacebar' || key === ' ' || key === 'Enter') {
      const octave = [3, 4, 5]
      const key = ["C", "D", "E", "F", "G", "A", "B"]
      const randomKey = key[Math.floor(Math.random() * key.length)]
      const randomOctave = octave[Math.floor(Math.random() * octave.length)]
      
      synth.triggerAttack(randomKey + randomOctave);
      synth.oscillator.type = 'sine3';
      synth.triggerRelease("+3");
    }
  }

  useEventListener('keydown', handler);

  if (loading) {
    return (
      <div className="App">
        <p style={{ position: "fixed", top: '20px', left: '10px', color: "#45542f" }}>
          press the 'Alt' key to mutate the text
        </p>
        <p style={{ position: "fixed", top: '40px', left: '10px', color: "#45542f" }}>
          better to play with sound on
        </p>
        <P5Canvas sentimentScore={sentimentScore} />
        <Canvas3d />
        <div style={{ position: "absolute", top: '40px', textAlign: 'center', fontSize: "36px" }}>
          Loading
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <p style={{ position: "fixed", top: '20px', left: '10px', color: "#45542f" }}>
        press the 'Alt' key to mutate the text
      </p>
      <p style={{ position: "fixed", top: '40px', left: '10px', color: "#45542f" }}>
        better to play with sound on
      </p>
      <P5Canvas sentimentScore={sentimentScore} />
      <Canvas3d />
      <div style={{ zIndex: 999 }}>
        <textarea 
          className='code'
          onChange={e => handleChange(e.target.value)}
          value={code}
        />
      </div>
    </div>
  );
}

export default App;

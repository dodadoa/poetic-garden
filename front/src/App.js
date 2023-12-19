import React, { useEffect, useState, Fragment } from 'react'
import useEventListener from '@use-it/event-listener'
import RiTa from 'rita'
import ml5 from 'ml5'
import * as Tone from 'tone'
import Canvas3d from './3d/Canvas3d'
import P5Canvas from './2d/P5Canvas'
import { Popover, Transition } from '@headlessui/react'

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
  const [loading, setLoading] = useState(true)
  const [poem, setPoem] = useState('')

  const nextWord = () => {
    let words = RiTa.tokenize(poem);
    const r = Math.floor(Math.random() * words.length);
    for (let i = r; i < words.length + r; i++) {
      const idx = i % words.length;
      const word = words[idx].toLowerCase();
      if (word.length < 3) continue;

      const pos = RiTa.tagger.allTags(word)[0];
      const rhymes = RiTa.rhymes(word, { pos });
      const sounds = RiTa.soundsLike(word, { pos });
      const spells = RiTa.spellsLike(word, { pos });
      const similars = [...rhymes, ...sounds, ...spells];

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

      words[idx] = next;
      break;
    }
    setPoem(RiTa.untokenize(words))
  }

  useEffect(() => {
    const loadMl5 = async () => {
      const sentiment = await ml5.sentiment('movieReviews', () => {
        console.log('modelReady')
        setLoading(false)
      });
      setSentimentModel(sentiment)
    }

    loadMl5()
  }, [])

  const handler = ({ key }) => {
    if (OPTIONS_KEYS.includes(String(key))) {
      nextWord()
    }

    // if (key === 'Spacebar' || key === ' ' || key === 'Enter') {
    //   const octave = [3, 4, 5]
    //   const key = ["C", "D", "E", "F", "G", "A", "B"]
    //   const randomKey = key[Math.floor(Math.random() * key.length)]
    //   const randomOctave = octave[Math.floor(Math.random() * octave.length)]
      
    //   synth.triggerAttack(randomKey + randomOctave);
    //   synth.oscillator.type = 'sine3';
    //   synth.triggerRelease("+3");
    // }
  }

  useEventListener('keydown', handler);

  if (loading) {
    return (
      <div className="fixed w-full h-full p-8 flex justify-center bg-white">
        <p style={{ position: "fixed", top: '20px', left: '10px', color: "#45542f" }}>
          press the 'Alt' key to mutate the text
        </p>
        {/* <p style={{ position: "fixed", top: '40px', left: '10px', color: "#45542f" }}>
          better to play with sound on
        </p> */}
        <P5Canvas sentimentScore={sentimentScore} />
        <Canvas3d />
        <div className='text-2xl'>
          Loading...
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { value } = e.target
    setPoem(value)
    // const prediction = sentimentModel.predict(value)
    // setSentimentScore(prediction.score)
  }

  return (
    <div className="fixed w-full h-full p-8 flex justify-center bg-white">
      <p style={{ position: "fixed", top: '40px', left: '20px', color: "#45542f" }}>
        press the 'Alt' key to mutate the text
      </p>
      <p style={{ position: "fixed", top: '60px', left: '20px', color: "#45542f" }}>
        better to play with sound on
      </p>
      <P5Canvas sentimentScore={sentimentScore} />
      <Canvas3d seed={sentimentScore} />
      <div className='w-[50%] h-[90%] rounded-lg shadow-lg p-4 bg-white/10'>
        <textarea 
          placeholder='Write a poem here...'
          className='w-full h-full outline-none text-lg resize-none bg-transparent'
          value={poem} 
          onChange={handleChange}
        />
      </div>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button>
              <span className='about' style={{ position: "fixed", top: '40px', right: '20px', color: "#45542f" }}>
                About
              </span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="fixed w-72 right-2 top-16">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative grid gap-2 bg-white p-4 lg:grid-cols-1">
                    <h3 className="text-xl">
                      About this project
                    </h3>
                    <p className="text-sm">
                      This project is about a combination of poetry, music, and visual art.
                    </p>
                  </div>
                  <div className="bg-gray-50 py-2 px-2">
                    <a
                      href="https://wsdigital.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          By <u>Wasawat Somno</u>
                        </span>
                      </span>
                      <span className="block text-sm text-gray-500">
                        wsdigital.dev
                      </span>
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
      )}
      </Popover>
    </div>
  );
}

export default App;

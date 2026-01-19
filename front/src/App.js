import React, { useEffect, useState, Fragment } from 'react'
import useEventListener from '@use-it/event-listener'
import RiTa from 'rita'
import ml5 from 'ml5'
import Canvas3d from './3d/Canvas3d'
import P5Canvas from './2d/P5Canvas'
import { Popover, Transition } from '@headlessui/react'
import './App.css'

// Dynamic import for Tone.js to avoid webpack issues
let Tone = null

const OPTIONS_KEYS = ['Alt'];

const speech = (text) => {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.volume = 1; // From 0 to 1
  msg.rate = 1; // From 0.1 to 10
  msg.pitch = Math.random() * 2; // From 0 to 2
  window.speechSynthesis.speak(msg);
}

const App = () => {
  const [sentimentModel, setSentimentModel] = useState(null)
  const [sentimentScore, setSentimentScore] = useState(0.0)
  const [loading, setLoading] = useState(true)
  const [poem, setPoem] = useState('')
  const [rand, setRand] = useState(Math.random())
  const [theme, setTheme] = useState('white')
  const [fontSize, setFontSize] = useState(16)

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
    setRand(Math.random())

    speech(RiTa.untokenize(words))
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

  useEffect(() => {
    let loop;
    
    const initTone = async () => {
      // Dynamically import Tone.js
      if (!Tone) {
        const ToneModule = await import('tone');
        Tone = ToneModule;
      }

      // Check if the audio context is in "suspended" state (this is the case on first load in some browsers)
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
      // Now the audio context is resumed, start the transport
      Tone.Transport.start();

      nextWord()

      // Create audio instruments after Tone is loaded
      const reverb = new Tone.Reverb({
        decay: 10,
        wet: 0.8,
        preDelay: 0.01
      }).toDestination();

      const AMsynth = new Tone.AMSynth().connect(reverb).toDestination();
      const synth = new Tone.Synth().toDestination();

      const feedbackDelay = new Tone.FeedbackDelay("1n", 0.5).toDestination();

      loop = new Tone.Loop(time => {
        const octave = [1, 2]
        const key = ["C", "D", "E", "F", "G", "A", "B"]
        const randomKey = key[Math.floor(Math.random() * key.length)]
        const randomOctave = octave[Math.floor(Math.random() * octave.length)]

        AMsynth.triggerAttack(randomKey + randomOctave, time);
        AMsynth.oscillator.type = 'sine3';
        AMsynth.triggerRelease("+3");
        AMsynth.volume.value = -4;

        synth.connect(feedbackDelay);
        synth.triggerAttackRelease(randomKey + randomOctave, time);
        synth.oscillator.type = 'sine3';
        synth.triggerRelease("+3");
        synth.volume.value = -4;

      }, '1n');

      loop.start(0);
    };

    initTone()

    return () => {
      if (loop) {
        loop.stop();
        loop.dispose();
      }
    };
  }, []);


  const handler = ({ key }) => {
    if (OPTIONS_KEYS.includes(String(key)) && Tone) {
      nextWord()
      const reverb = new Tone.Reverb({
        decay: 10,
        wet: 0.2,
        preDelay: 0.01
      }).toDestination();

      const pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();

      const octave = [3,4,5]
      const key = ["C", "D", "E", "F", "G", "A", "B"]
      const randomKey = key[Math.floor(Math.random() * key.length)]
      const randomOctave = octave[Math.floor(Math.random() * octave.length)]

      const membraneSynth = new Tone.MembraneSynth().toDestination();

      membraneSynth.triggerAttackRelease(randomKey + randomOctave, "1n");
      membraneSynth.oscillator.type = 'sine3';
      membraneSynth.connect(reverb);
      membraneSynth.connect(pingPong);
      membraneSynth.triggerRelease("+3");
      membraneSynth.volume.value = -12;

    }
  }

  useEventListener('keydown', handler);

  if (loading) {
    return (
      <div className="fixed w-full h-full p-8 flex justify-center bg-white">
        <p style={{ position: "fixed", top: '40px', left: '20px', color: "#45542f", textWrap: 'wrap', width: '15rem' }}>
          press the 'Alt (or option in mac)' key to mutate the text
        </p>
        <p style={{ position: "fixed", top: '120px', left: '20px', color: "#45542f" }}>
          better to play with sound on
        </p>
        <P5Canvas sentimentScore={sentimentScore} />
        <Canvas3d rand={rand}/>
        <div className='text-2xl'>
          Loading...
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { value } = e.target
    setPoem(value)
  }

  return (
    <div className={`fixed w-full h-full p-8 flex justify-center bg-${theme}`}>
      <p style={{ position: "fixed", top: '40px', left: '20px', color: theme === 'white' ? "#45542f" : "white", textWrap: 'wrap', width: '15rem' }}>
        press the 'Alt (or option in mac)' key to mutate the text
      </p>
      <p style={{ position: "fixed", top: '120px', left: '20px', color: theme === 'white' ? "#45542f" : "white" }}>
        better to play with sound on
      </p>
      <P5Canvas sentimentScore={sentimentScore} />
      <Canvas3d rand={rand}/>
      <div className='w-[50%] h-[90%] rounded-lg shadow-lg p-4 bg-white/50 ring-5 ring-black/5'>
        <textarea 
          placeholder='Write a poem here...'
          className='w-full h-full outline-none text-lg resize-none bg-transparent'
          value={poem} 
          onChange={handleChange}
          style={{ fontSize: `${fontSize}px` }}
        />
      </div>
      <div className="flex flex-col gap-3 fixed top-2 right-2">
        <Popover className="relative">
          {() => (
            <>
              <Popover.Button>
                <span className='about' style={{ color: theme === 'white' ? "#45542f" : "white" }}>
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
                <Popover.Panel className="absolute w-72 right-2 top-16">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                    <div className="relative grid gap-2 bg-white p-4 lg:grid-cols-1">
                      <h3 className="text-xl">
                        About this project
                      </h3>
                      <p className="text-sm">
                      Touching the keyboard to feel the grass. 
                      Hearing the synthesizer sound to feel the wind. 
                      Mutating the word to feel the spirit. 
                      Poetic Garden is a place to write poem with generative visual and sound.
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
        <Popover className="relative">
          {() => (
            <>
              <Popover.Button>
                <span className='about' style={{ color: theme === 'white' ? "#45542f" : "white" }}>
                  Config
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
                <Popover.Panel className="absolute w-72 right-2 top-18">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                    <div className="relative grid gap-2 bg-white p-4 lg:grid-cols-1">
                      <h3 className="text-xl">
                        Theme
                      </h3>
                      <button className='bg-white text-black p-2 rounded-md' onClick={() => setTheme('white')}>
                        White
                      </button>
                      <button className='bg-black text-white p-2 rounded-md' onClick={() => setTheme('black')}>
                        Black
                      </button>
                    </div>
                    <div className="relative grid gap-2 bg-white p-4 lg:grid-cols-1">
                      <h3 className="text-xl">Font Size</h3>
                      <button className='bg-white text-black p-2 rounded-md' onClick={() => setFontSize(16)}>
                        16
                      </button>
                      <button className='bg-white text-black p-2 rounded-md' onClick={() => setFontSize(20)}>
                        20
                      </button>
                      <button className='bg-white text-black p-2 rounded-md' onClick={() => setFontSize(24)}>
                        24
                      </button>
                      <button className='bg-white text-black p-2 rounded-md' onClick={() => setFontSize(28)}>
                        28
                      </button>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
        )}
        </Popover>
      </div>
    </div>
  );
}

export default App;

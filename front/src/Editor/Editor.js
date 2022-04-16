import React, { useRef, useEffect, useState } from "react"
import { useCodeMirror } from '@uiw/react-codemirror'
import RiTa from 'rita'
import ml5 from 'ml5'
import { poetic } from './extended/theme'

import './Editor.css'

const MyEditor = () => {

  const [sentimentModel, setSentimentModel] = useState(null)

  const modelReady = () => {
    console.log('model ready')
  }

  const handleChange = (text) => {
    const analyzed = RiTa.analyze(text);
    const prediction = sentimentModel.predict(text)

    console.log(analyzed, prediction)
  }

  const editor = useRef();
  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: '',
    theme: poetic,
    autoFocus: true,
    minHeight: 200,
    height: 200,
    onChange: handleChange
  });

  useEffect(() => {
    const loadMl5 = async () => {
      const sentiment = await ml5.sentiment('movieReviews', modelReady);
      setSentimentModel(sentiment)
    }

    loadMl5()
  }, [])

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.current]);

  return (
    <>
      <div
        className="editor-container"
      >
        <div ref={editor} />
      </div>
    </>

  );
}

export default MyEditor

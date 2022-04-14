import React, { useRef, useEffect } from "react"
import { useCodeMirror } from '@uiw/react-codemirror';
import { poetic } from './extended/theme'

import './Editor.css'

const MyEditor = () => {

  const handleChange = (e) => {
    console.log(e)
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

import React, { useRef, useEffect } from "react"
import { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark';

import './Editor.css'

const MyEditor = () => {

  const editor = useRef();
  const { setContainer } = useCodeMirror({
    container: editor.current,
    extensions: [javascript()],
    value: '',
    theme: oneDark,
    autoFocus: true,
    minHeight: 200,
    height: 200
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

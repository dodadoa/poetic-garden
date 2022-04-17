import { EditorView } from "@codemirror/view"

const COLOR = {
  transparent: "transparent",
  green: "#9fcc38"
}

export const poetic = EditorView.theme({
  "&": {
    color: COLOR.green,
    backgroundColor: COLOR.transparent,
    fontFamily: "Croissant One",
    fontSize: "24px"
  },
  "&.ͼ1.cm-editor": {
    zIndex: "2"
  },
  ".cm-gutters": {
    display: "none"
  },
  ".cm-activeLine": {
    backgroundColor: COLOR.transparent,
    fontFamily: "Croissant One"
  },
  ".cm-panels": {
    backgroundColor: COLOR.transparent,
    color: COLOR.green,
    fontFamily: "Croissant One"
  },
  ".cm-line": {
    backgroundColor: COLOR.transparent,
    color: COLOR.green,
    fontFamily: "Croissant One"
  },
  "&.ͼ1.cm-editor.cm-focused": {
    outline: "none"
  },
}, { dark: true })

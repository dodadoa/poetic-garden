import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";
import './P5Canvas.css'
import FireFly from "./FireFly";

const fireFlies = [];
let newComingOscValue = false
let newComingSentimentScore = false

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const P5Canvas = (props) => {

  const { oscValue, sentimentScore } = props
  const prevSentimentScore = usePrevious(sentimentScore)

  useEffect(() => {

    if (prevSentimentScore !== sentimentScore) {
      newComingSentimentScore = true
    }
  }, [sentimentScore, prevSentimentScore])

  return (
    <div className="p5canvas-container">
      {/* <Sketch setup={setup} draw={draw} />; */}
    </div>
  )
}

export default P5Canvas

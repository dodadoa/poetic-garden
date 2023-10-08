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

  const setup = (p5, canvasParentRef) => {
    p5.colorMode(p5.HSL, 360, 3, 2, 1);
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef)
    for (let i = 0; i < 100; i++) {
      fireFlies.push(
        new FireFly(
          {
            x: p5.random(p5.width),
            y: p5.random(p5.height)
          },
          i / 3,
          p5.random(100),
          p5
        )
      );
    }
  }

  const draw = (p5) => {
    p5.background('rgba(0%,4%,0%,1.0)');
    p5.colorMode(p5.HSL, 360, 3, 2, 1);

    fireFlies.forEach((firefly, i) => {
      firefly.render()
    });

    if (oscValue) {
      if (Number.parseFloat(oscValue) > 0.5 && newComingOscValue) {
        console.log('adding new fireFly')
        p5.background('rgba(0%,4%,0%,1.0)');
        fireFlies.push(
          new FireFly(
            {
              x: p5.random(p5.width),
              y: p5.random(p5.height - 200)
            },
            100,
            5,
            p5
          )
        );

        newComingOscValue = false
      } else if (Number.parseFloat(oscValue) <= 0.5 && newComingOscValue) {
        p5.background('rgba(0%,8%,4%,1.0)');
        fireFlies.splice(-1, 1)
        newComingOscValue = false
      }
    }

    if (sentimentScore <= 0.5 && newComingSentimentScore) {
      p5.push();
      p5.blendMode(p5.ADD)
      p5.noStroke();
      for (let i = 0; i < 1; i += 0.01) {
        p5.fill(p5.frameCount % 300, 1.7, i * 0.1, 0.7 - i)
        p5.ellipse(p5.width / 2, p5.height / 2, 1000 * i);
      }
      p5.pop();
    } else if (sentimentScore > 0.5 && newComingSentimentScore) {
      p5.push();
      p5.blendMode(p5.ADD)
      p5.noStroke();
      for (let i = 0; i < 1; i += 0.01) {
        p5.fill(p5.frameCount % 300, 0.9, i * 0.5, 0.7 - i)
        p5.ellipse(p5.width / 2, p5.height / 2, 1000 * i);
      }
      p5.pop();
    }
  }

  return (
    <div className="p5canvas-container">
      <Sketch setup={setup} draw={draw} />;
    </div>
  )
}

export default P5Canvas

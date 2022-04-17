import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";
import './P5Canvas.css'

class FireFly {
  constructor(pos, r, v, p5context) {
    this.p5 = p5context
    this.offset = ((r / v) / 40)
    this.pos = this.p5.createVector(pos.x, pos.y)
    this.vel = this.p5.createVector(this.p5.random(-this.offset, this.offset), this.p5.random(-1, 1))
    this.acc = this.p5.createVector()
    this.r = r
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    return this;
  }

  display() {
    this.p5.push();
    this.p5.blendMode(this.p5.ADD);
    this.p5.noStroke();
    for (let i = 0; i < 1; i += 0.1) {
      this.p5.fill(this.p5.frameCount % 1000, 0.9, i, 0.7 - i)
      this.p5.ellipse(this.pos.x, this.pos.y, this.r * i);
    }
    this.p5.pop();

    return this;
  }

  bounds() {
    if (this.pos.x <= 0 || this.pos.x >= this.p5.width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= this.p5.width) this.vel.y *= -1;

    return this;
  }

  render() {
    return this.update().display().bounds();
  }
}

const fireFlies = [];
let newComingValue = false

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const P5Canvas = (props) => {

  const { oscValue } = props
  const prev = usePrevious(oscValue);

  useEffect(() => {
    if (prev !== oscValue) {
      newComingValue = true
    }
  }, [oscValue, prev])

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

    if (Number.parseFloat(props.oscValue) > 0.5 && newComingValue) {
      console.log('adding new fireFly')
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
      newComingValue = false
    } else if (Number.parseFloat(props.oscValue) <= 0.5 && newComingValue) {
      fireFlies.splice(-1, 1)
      newComingValue = false
    }
  }

  return (
    <div className="p5canvas-container">
      <Sketch setup={setup} draw={draw} />;
    </div>
  )
}

export default P5Canvas

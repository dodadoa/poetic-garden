import React from "react";
import Sketch from "react-p5";
import './P5Canvas.css'

const fireFlies = [];

class FireFly {
  constructor(pos, r, v, p5context) {
    this.p5 = p5context
    this.offset = ((r / v) / 40)
    this.pos = this.p5.createVector(pos.x, pos.y)
    this.vel = this.p5.createVector(this.p5.random(-this.offset, this.offset), this.p5.random(-1, 1))
    this.acc = this.p5.createVector()
    this.r = r
    this.col = {
      h: null,
      s: null,
      b: null,
      a: 1
    }

    this.rot = 0;
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
      this.p5.fill(this.p5.frameCount % 360, 0.9, i, 0.7 - i);
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

const P5Canvas = (props) => {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef)
    for (let i = 0; i < 100; i++) {
      fireFlies.push(
        new FireFly({
          x: p5.random(p5.width),
          y: p5.random(p5.height)
        },
          5 * i,
          1,
          p5
        )
      );
    }
  }

  const draw = (p5) => {
    p5.background('rgba(0%,0%,0%,0.0)');
    fireFlies.forEach(firefly => {
      firefly.render()
    });
  }

  return (
    <div className="p5canvas-container">
      <Sketch setup={setup} draw={draw} />;
    </div>
  )
}

export default P5Canvas

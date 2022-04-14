import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Meadow3d from './Meadow/Meadow3d'
import './Canvas3d.css'

export default function Canvas3d() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [10, 5, 50] }}>
        <ambientLight />
        <Suspense fallback={null}>
          <Meadow3d />
        </Suspense>
      </Canvas>
    </div>
  )
}

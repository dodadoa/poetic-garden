import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Meadow3d from './Meadow/Meadow3d'
import './Canvas3d.css'

export default function Canvas3d() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [15, 15, 15] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Meadow3d position={[-1, 0, 0]} />
        </Suspense>
      </Canvas>
    </div>
  )
}

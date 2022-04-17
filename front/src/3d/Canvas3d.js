import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Meadow3d from './Meadow/Meadow3d'
import './Canvas3d.css'

const Canvas3d = (props) => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [10, 5, 50] }}>
        <Suspense fallback={null}>
          <Meadow3d />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Canvas3d

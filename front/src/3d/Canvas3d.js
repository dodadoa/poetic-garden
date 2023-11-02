import React from 'react'
import { Canvas } from '@react-three/fiber'
import Meadow3d from './Meadow/Meadow3d'
import './Canvas3d.css'

const Canvas3d = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [10, 5, 50] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 0]} />
        <Meadow3d />
      </Canvas>
    </div>
  )
}

export default Canvas3d

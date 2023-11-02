import React from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import './Canvas3d.css'

const Canvas3d = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 0]} />
      </Canvas>
    </div>
  )
}

export default Canvas3d

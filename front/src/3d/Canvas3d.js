import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cloud, Clouds, CameraShake } from '@react-three/drei'
import * as THREE from 'three'
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing'

import './Canvas3d.css'

const CloudMoving = () => {
  const [volume, setVolume] = useState(2)

  const cloudRef = useRef()
  useFrame(() => {
    setVolume((prevVolume) => prevVolume + 0.01)
    cloudRef.current.rotation.y += 0.0005
  })

  return (
    <Cloud 
      ref={cloudRef}
      seed={10}
      segments={5}
      scale={1.5} 
      bounds={[2, 2, 2]}
      position={[0, 0, 0]} 
      growth={1}
      volume={Math.sin(volume) * 0.2 + 2} 
      color="white"
      concentrate="random"
      opacity={1}
      fade={0.8}
    />
  )
}

const Canvas3d = (props) => {

  useFrame(() => {

  })

  return (
    <>
      <ambientLight />
      <pointLight position={[0, 0, 1]} />
      <Clouds material={THREE.MeshBasicMaterial} limit={5}>
        <CloudMoving />
      </Clouds>
    </>
  )
}

const CanvasWrapper = (props) => {
  return (
    <div className="canvas3d-container">
      <Canvas>
        <EffectComposer>
          <DepthOfField focusDistance={1} focalLength={1} bokehScale={2} height={1000} />
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={3} />
        </EffectComposer>
        <Canvas3d {...props} />
      </Canvas>
    </div>
  )
}

export default CanvasWrapper


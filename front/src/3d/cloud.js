import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'

const CloudMoving = () => {
  const cloudRef = useRef()
  useFrame(() => {
    cloudRef.current.rotation.y += 0.0005
  })

  return (
    <Clouds material={THREE.MeshBasicMaterial} limit={5}>
      <Cloud
        ref={cloudRef}
        segments={5}
        scale={1.5}
        bounds={[2, 2, 2]}
        position={[0, 0, 0]}
        growth={1}
        volume={2}
        color="white"
        concentrate="random"
        opacity={1}
        fade={0.8}
      />
    </Clouds>
  )
}

export default CloudMoving

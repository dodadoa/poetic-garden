import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

const CloudMoving = (props) => {
  const cloudRef = useRef()
  useFrame(() => {
    cloudRef.current.rotation.y += 0.0005
  })

  useEffect(() => {
    let position = Math.random() > 0.5
      ? [Math.random() * 2, Math.random() * 2, Math.random() * 2] 
      : [-Math.random() * 2, -Math.random() * 2, -Math.random() * 2]

    if (cloudRef.current) {
      gsap.to(cloudRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 1, // duration of the animation in seconds
        ease: "power1.inOut", // easing function for the animation
      })
    }
  }, [props.rand])

  return (
    <Clouds material={THREE.MeshBasicMaterial} limit={5}>
      <Cloud
        ref={cloudRef}
        segments={5}
        scale={1.5}
        bounds={[2, 2, 2]}
        position={props.position || [0, 0, 0]}
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

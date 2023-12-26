import { Canvas } from '@react-three/fiber'
import { Bloom, DotScreen, EffectComposer, DepthOfField, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

import Tree from './tree.js'
import Cloud from './cloud.js'

import './Canvas3d.css'

const Canvas3d = (props) => {
  return (
    <>
      <directionalLight
        position={[2.5, 8, 5]}
        intensity={0.45}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={0.15} />
      <Tree position={[0, -2.5, 1]}/>
      <Cloud />
    </>
  )
}

const CanvasWrapper = (props) => {
  return (
    <div className="canvas3d-container">
      <Canvas>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0} 
            luminanceSmoothing={1} 
            height={8}
            intensity={1.5} 
          />
          <DotScreen
            blendFunction={BlendFunction.ALPHA} 
            angle={Math.PI * 2} 
            scale={0.9}
          />
          <DepthOfField focusDistance={2} focalLength={0.02} bokehScale={2} height={480} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
        <Canvas3d {...props} />
      </Canvas>
    </div>
  )
}

export default CanvasWrapper


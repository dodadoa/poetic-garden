import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Color, FrontSide, MeshStandardMaterial } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import foiliageAlphaPng from './mat/foliage_alpha3.png';
import vert from './vert.glsl.js';

export function FoliageMaterial() {
  const ref = useRef(null);
  const alphaMap = useTexture(foiliageAlphaPng)

  useFrame((_, delta) => {
    ref.current.uniforms.u_windTime.value += ref.current.uniforms.u_windSpeed.value * delta;
  });

  const uniforms = useMemo(
    () => ({
      u_effectBlend: { value: 0.75 },
      u_inflate: { value: .4 },
      u_scale: { value: 1.0 },
      u_windSpeed: { value: 1.2 },
      u_windTime: { value: 0.0 },
    }),
    []
  );

  return (
    <CustomShaderMaterial
      alphaMap={alphaMap}
      alphaTest={0.99}
      baseMaterial={MeshStandardMaterial}
      color={new Color('#e8e8e8').convertLinearToSRGB()}
      ref={ref}
      uniforms={uniforms}
      vertexShader={vert}
      shadowSide={FrontSide}
    />
  );
}

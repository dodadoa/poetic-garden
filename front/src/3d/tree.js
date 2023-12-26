import { Clone, useGLTF } from '@react-three/drei';
import { FoliageMaterial } from './foliage';
import TreeGLB from './mat/tree.glb';

const Tree = ({ position, rotation }) => {
  const tree = useGLTF(TreeGLB);

  return (
    <group name="tree" rotation={rotation} position={position} scale={0.6}>
      <Clone
        receiveShadow
        castShadow
        object={tree.nodes.trunk}
        inject={<meshBasicMaterial color="#8c8c8c" />}
      />
      <Clone
        receiveShadow
        castShadow object={tree.nodes.foliage} 
        inject={<FoliageMaterial />} 
      />
    </group>
  );
}

export default Tree

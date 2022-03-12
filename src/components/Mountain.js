import React, { useEffect, useRef } from 'react';
import { useGLTF, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from '@react-three/fiber';
import './Mountain.css'
const Lights = () =>{
  return (
    <>
      <ambientLight intensity={.3} />
      <directionalLight position={[10,10,5]} intensity={1} />
    </>
  )
};
const IndivCloud = ({canvasRef, pos}) => {
  const cloud_texture = useTexture('/smoke.png');
  let my_position, my_rotation;
  if (pos === 1){
    my_position=[0,-49.3, 0];
    my_rotation=[-Math.PI/2, 0, 0];
  } else if (pos===2){
    my_position=[0,-49.2, 0];
    my_rotation=[-Math.PI/2, 0, Math.PI/2];
  }
  const mesh = useRef();
  useFrame((state, delta) => (mesh.current.rotation.z -= 0.001))
  return (
      <mesh position={my_position} ref={mesh} rotation={my_rotation} material={{opacity: .55}}>
        <meshLambertMaterial map={cloud_texture} transparent={true}/>
        <planeBufferGeometry attach="geometry" args={[600,600]} />
      </mesh>
  )
};
const make50 = (canvasRef) => {
  const myArray = Array.apply(null, Array(5))
  
  return myArray.map((elem, i) => {
      return (
        <>
          <IndivCloud key={`xp_${i}`} pos={1} canvasRef={canvasRef}/>
          <IndivCloud key={`yp_${i}`} pos={2} canvasRef={canvasRef}/>
        </>
      )
  })
};
const Clouds = ({canvasRef}) => {
  return (
    <>
      {make50(canvasRef)}
    </>
  )
};

const Mountain = () => {
    const gltf = useGLTF('/scene.glb');
    const canvasRef = useRef()
    useEffect(()=>console.log(canvasRef),[])
    

return (
    <Canvas ref={canvasRef} className="mountain-canvas" colorManagement camera={{position:[-120,0,120], fov: 70}}>
      <OrbitControls  maxPolarAngle={[Math.PI/1.65]} maxDistance={135} minDistance={50}/>
      <Stars />
      <fog attach="fog" args={["white", 100, 200]} />
      <Lights />
      <mesh position={[0,-50,0 ]}>
        <primitive object={gltf.scene} dispose={null}/>
      </mesh>
      {/* <Clouds canvasRef={canvasRef}/> */}
      
    </Canvas>
)
}

useGLTF.preload('/scene.glb')

export default Mountain


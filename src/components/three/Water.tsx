import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/Addons.js";

const WaterPlane = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const waterRef = useRef<Water>(null!);
  const normalMap = useLoader(THREE.TextureLoader, "textures/waterNormal.jpg");
  const scene = useThree((state) => state.scene);

  const [waterDebugObject, setWaterDebugObject] = useState({});

  useEffect(() => {
    if (!ref.current) return;

    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    const planeGeometry = new THREE.PlaneGeometry(500, 500);

    const water = new Water(planeGeometry, {
      textureHeight: 512,
      textureWidth: 512,
      waterNormals: normalMap,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 1,
      fog: scene.fog !== undefined,
      // alpha: .8
    });

    water.rotation.x = -Math.PI / 2;
    water.position.y = -5;
    ref.current.add(water);
    waterRef.current = water;

    // waterRef.current.material.transparent = true;
    // waterRef.current.material.opacity = 0.5;
    // waterRef.current.material.depthWrite = false;
  }, [normalMap]);

  useFrame((_, delta) => {
    waterRef.current.material.uniforms.time.value += delta;
  });

  return <group ref={ref} />;
};

export default WaterPlane;

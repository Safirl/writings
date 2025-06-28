import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Loading from "../Loading";
import Planet from "./Planet";
import Environment from "./Environment";
import { GUI } from 'lil-gui'
import InteractiveCard from "./InteractiveCard";

const SceneCanvas = () => {
  const [radius, setRadius] = useState<number>(100);

  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 200], fov: 75 }}>
        <Environment />
        <Planet onChangeRadius={setRadius} radius={radius} />
        <InteractiveCard planetRadius={radius} angle={{ theta: 0, phi: Math.PI }} />
      </Canvas>
    </Suspense>
  );
};

export default SceneCanvas;
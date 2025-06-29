import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Loading from "../Loading";
import Planet from "./Planet";
import Environment from "./Environment";
import { GUI } from 'lil-gui'
import InteractiveCard from "./InteractiveCard";

interface CanvasProps {
  projects: { id: number, title: string }[]
}

const SceneCanvas = (props: CanvasProps) => {
  const [radius, setRadius] = useState<number>(100);

  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 10, 200], fov: 75 }}>
        <Environment />
        <Planet onChangeRadius={setRadius} radius={radius} />
        {props.projects.map((project) => {
          return (
            <InteractiveCard planetRadius={radius} angle={{ theta: (Math.random() - 0.5) * 6, phi: (Math.random()) * Math.PI / 4 }} key={project.id} id={project.id} />
          )
        })}
      </Canvas>
    </Suspense>
  );
};

export default SceneCanvas;
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Loading from "../Loading";
import Planet from "./Planet";
import Environment from "./Environment";
import InteractiveCard from "./InteractiveCard";
import { StatsGl } from "@react-three/drei";
import projects from "../../data/projects";

const SceneCanvas = () => {
  const [radius, setRadius] = useState<number>(95);
  const [bDisableOrbitControls, setDisableOrbitControls] = useState(false);

  function onCardClicked() {
    setDisableOrbitControls(true);
  }

  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [0, 10, 200], fov: 75 }}>
        {/* Debug */}
        {/* <StatsGl /> */}
        {/* End of debug */}
        <Environment bDisableOrbitControls={bDisableOrbitControls} />
        <Planet onChangeRadius={setRadius} radius={radius} />
        {projects.map((project) => {
          return (
            <InteractiveCard
              text={project.title}
              imgURL={project.imgURL}
              planetRadius={radius}
              angle={{
                theta: project.theta /*(Math.random() - 0.5) * 6*/,
                phi: project.phi /*(Math.random() * Math.PI) / 4*/,
              }}
              key={project.id}
              id={project.id}
              onCardClicked={onCardClicked}
            />
          );
        })}
      </Canvas>
    </Suspense>
  );
};

export default SceneCanvas;

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Loading from "../Loading";
import Planet from "./Planet";
import Environment from "./Environment";
import InteractiveCard from "./InteractiveCard";
import { StatsGl } from "@react-three/drei";
import projects from "../../data/projects";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three"

interface SceneCanvasProps {
  onCardClicked: (id: number) => void;
  currentCardId: number;
  transitionTimers: { key: string, value: number }[]
}

const SceneCanvas = (props: SceneCanvasProps) => {
  const [radius, setRadius] = useState<number>(95);
  const { currentCardId, transitionTimers } = props
  const transitionObjectRef = useRef<HTMLDivElement>(null!)

  const { contextSafe } = useGSAP();

  useGSAP(() => {
    if (!transitionObjectRef.current) return;
    setTimeout(() => {
      gsap.to(transitionObjectRef.current.style, {
        opacity: currentCardId != null ? 1 : 0,
        duration: getTransitionObjectDuration(),
        ease: "power2.inOut",
      });
    }, getTransitionObjectDelay());
  }, [currentCardId])

  const getTransitionObjectDelay = () => {
    if (currentCardId != null) {
      return transitionTimers.find((timer) => timer.key === "transitionObjectDelayIn")?.value
    }
    return transitionTimers.find((timer) => timer.key === "transitionObjectDelayOut")?.value
  }

  const getTransitionObjectDuration = () => {
    if (currentCardId != null) {
      return transitionTimers.find((timer) => timer.key === "transitionObjectDurationIn")?.value! / 1000
    }
    return transitionTimers.find((timer) => timer.key === "transitionObjectDurationOut")?.value! / 1000
  }


  return (
    <Suspense fallback={<Loading />}>
      <Canvas camera={{ position: [0, 10, 200], fov: 75, userData: { isMainCamera: true } }}>
        {/* Debug */}
        {/* <StatsGl /> */}
        {/* End of debug */}
        <Environment isCardClicked={currentCardId != null} transitionTimers={transitionTimers} />
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
              onCardClicked={props.onCardClicked}
            />
          );
        })}
        <Planet onChangeRadius={setRadius} radius={radius} />
      </Canvas>
      <div
        ref={transitionObjectRef}
        id="transitionObject"
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "#0f0f0f",
          pointerEvents: "none",
          opacity: "0",
        }}
      ></div>
    </Suspense>
  );
};

export default SceneCanvas;

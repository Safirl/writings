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
import CameraManager from "./CameraManager";
import { type animationObject } from "./CameraManager";

interface SceneCanvasProps {
  onCardClicked: (id: number) => void;
  currentCardId: number;
  transitionTimers: { key: string, value: number }[]
}

const SceneCanvas = (props: SceneCanvasProps) => {
  const [radius, setRadius] = useState<number>(95);
  const { currentCardId, transitionTimers } = props
  const transitionObjectRef = useRef<HTMLDivElement>(null!)
  const [cameraAnimationObject, setCameraAnimationObject] = useState<animationObject>()

  useGSAP(() => {
    if (!transitionObjectRef.current || currentCardId == null) return;
    setTimeout(() => {
      gsap.to(transitionObjectRef.current.style, {
        opacity: currentCardId != -1 ? 1 : 0,
        duration: getTransitionObjectDuration(),
        ease: "power2.inOut",
      });
    }, getTransitionObjectDelay());

    if (currentCardId == -1) {
      console.log("coucou")
      cardTransitionOut()
    }
  }, [currentCardId])

  const cardTransitionOut = () => {
    setCameraAnimationObject({
      targetPosition: new THREE.Vector3(5, 50, -500),
      delay: 0,
      duration: 0,
      ease: ""
    })
    setCameraAnimationObject({
      targetPosition: new THREE.Vector3(5, 50, -500),
      delay: 0,
      duration: 0,
      ease: ""
    })
  }

  const getTransitionObjectDelay = () => {
    if (currentCardId != -1) {
      return transitionTimers.find((timer) => timer.key === "transitionObjectDelayIn")?.value
    }
    return transitionTimers.find((timer) => timer.key === "transitionObjectDelayOut")?.value
  }

  const getTransitionObjectDuration = () => {
    if (currentCardId != -1) {
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
        <Environment isCardClicked={currentCardId != null && currentCardId != -1} transitionTimers={transitionTimers} />
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
              canBeClicked={currentCardId == null}
            />
          );
        })}
        <Planet onChangeRadius={setRadius} radius={radius} />
        <CameraManager animationObject={cameraAnimationObject!} />
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

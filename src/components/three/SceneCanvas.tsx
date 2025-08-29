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
  const [enableOrbitControls, setEnableOrbitControls] = useState(true)
  const [currentCardTransform, setCurrentCardTransform] = useState<{ position: THREE.Vector3, rotation: THREE.Euler, forward: THREE.Vector3 }>(null!)
  const [isIntro, setIsIntro] = useState(true)

  useGSAP(() => {
    if (!isIntro) return;
    gsap.to(transitionObjectRef.current.style, {
      opacity: 0,
      duration: (transitionTimers.find((timer) => timer.key === "transitionObjectIntroIn")?.value!) / 1000,
      ease: "power2.inOut",
      onComplete: () => { setIsIntro(false) }
    });
  }, [])

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
      setEnableOrbitControls(false)
      cardTransitionOut()
    }
  }, [currentCardId])

  const cardTransitionOut = () => {
    let targetPosition = new THREE.Vector3();
    targetPosition = currentCardTransform.position
      .clone()
      .add(currentCardTransform.forward.multiplyScalar(1.5));
    setCameraAnimationObject({
      targetPosition: targetPosition,
      targetRotation: new THREE.Euler(currentCardTransform?.rotation.x, currentCardTransform?.rotation.y, currentCardTransform.rotation.z),
      delay: 0,
      duration: (transitionTimers.find((timer) => timer.key === "projectOut")?.value!),
      ease: "power2.inOut",
      onComplete: () => {
        setCameraAnimationObject(undefined)
        setEnableOrbitControls(true)
      }
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

  const getTransitionProjectDuration = () => {
    if (currentCardId != -1) {
      return transitionTimers.find((timer) => timer.key === "transitionObjectDurationIn")?.value! / 1000
    }
    return transitionTimers.find((timer) => timer.key === "transitionObjectDurationOut")?.value! / 1000
  }

  const onCardClicked = (id: number, cardPosition: THREE.Vector3, cardRotation: THREE.Euler, forward: THREE.Vector3) => {
    setCurrentCardTransform({ position: cardPosition, rotation: cardRotation, forward })
    props.onCardClicked(id)
  }


  return (
    <Suspense fallback={<Loading />}>
      <Canvas camera={{ position: [0, 10, 200], fov: 75, userData: { isMainCamera: true } }}>
        {/* Debug */}
        {/* <StatsGl /> */}
        {/* End of debug */}
        <Environment enableOrbitControls={enableOrbitControls} isCardClicked={currentCardId != null && currentCardId != -1} transitionTimers={transitionTimers} />
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
              canBeClicked={currentCardId == null || currentCardId == -1}
              enableCard={!isIntro}
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
          opacity: "1",
        }}
      ></div>
    </Suspense>
  );
};

export default SceneCanvas;

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

interface SceneCanvasProps {
  onDisplayCardContent: (id: number) => void;
}

const SceneCanvas = (props: SceneCanvasProps) => {
  const [radius, setRadius] = useState<number>(95);
  const [isCardClicked, setIsCardClicked] = useState(false);
  const transitionObjectRef = useRef<HTMLDivElement>(null!)
  const [currentCardId, setCurrentCardId] = useState<number>(null!)

  const { contextSafe } = useGSAP();

  function onCardClicked(id: number) {
    setCurrentCardId(id);
    setIsCardClicked(true);
  }

  useGSAP(() => {
    if (!transitionObjectRef.current) return;
    setTimeout(() => {

      gsap.to(transitionObjectRef.current.style, {
        opacity: isCardClicked ? 1 : 0,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => { props.onDisplayCardContent(currentCardId) }
      });
    }, 3000);
  }, [isCardClicked])

  return (
    <Suspense fallback={<Loading />}>
      <Canvas camera={{ position: [0, 10, 200], fov: 75, userData: { isMainCamera: true } }}>
        {/* Debug */}
        {/* <StatsGl /> */}
        {/* End of debug */}
        <Environment isCardClicked={isCardClicked} />
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
        <Planet onChangeRadius={setRadius} radius={radius} />
      </Canvas>
      <div
        ref={transitionObjectRef}
        id="transitionObject"
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "black",
          pointerEvents: "none",
          opacity: "0",
        }}
      ></div>
    </Suspense>
  );
};

export default SceneCanvas;

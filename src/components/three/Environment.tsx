import { Circle, OrbitControls } from "@react-three/drei";
import Fog from "./Fog";
import { useEffect, useRef, useState } from "react";
import type GUI from "lil-gui";
import getOrCreateGUI from "./debugUI";
import WaterPlane from "./Water";
import { Sky } from "@react-three/drei";
import {
  DepthOfField,
  EffectComposer,
  ChromaticAberration,
  Vignette,
  TiltShift,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiquidMaterial from "../LiquidMaterial";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";

interface EnvironmentProps {
  bDisableOrbitControls: boolean;
}

const Environment = (props: EnvironmentProps) => {
  const liquidMaterialRef = useRef<THREE.ShaderMaterial>(null!);

  const [cameraSettings, setCameraSettings] = useState({
    zoomMin: 153,
    zoomMax: 200,
    rotateSpeed: 0.25,
    zoomSpeed: 0.1,
    minPolarAngle: Math.PI / 3,
    maxPolarAngle: Math.PI / 2,
    enableZoom: true,
    enableRotate: true,
    vignetteDarkness: 0.5,
  });
  const [skySettings, setSkySettings] = useState({
    turbidity: 10,
    mieCoefficient: 0.1,
    mieDirectionalG: 0.95,
    sunPosition: { x: 0.3, y: -0.038, z: -0.95 },
  });

  useEffect(() => {
    setCameraSettings((prev) => ({
      ...prev,
      enableZoom: !props.bDisableOrbitControls,
      enableRotate: !props.bDisableOrbitControls,
      zoomMin: props.bDisableOrbitControls ? 0 : 153,
    }));
  }, [props.bDisableOrbitControls]);

  useGSAP(() => {
    const gsapState = { darkness: cameraSettings.vignetteDarkness };
    setTimeout(() => {
      gsap.to(gsapState, {
        darkness: props.bDisableOrbitControls ? 10 : 0.5,
        duration: 8,
        ease: "power2.in",
        onUpdate() {
          setCameraSettings((prev) => ({
            ...prev,
            vignetteDarkness: gsapState.darkness,
          }));
        },
      });
    }, 500);
    setTimeout(() => {
      const transitionObject = document.getElementById("transitionObject");
      if (!transitionObject) return;
      gsap.to(transitionObject.style, {
        opacity: props.bDisableOrbitControls ? 1 : 0,
        duration: 2,
        ease: "power2.inOut",
      });
      transitionObject.style.opacity;
    }, 4500);
  }, [props.bDisableOrbitControls]);

  useFrame((state) => {
    if (!liquidMaterialRef.current) return;
    liquidMaterialRef.current.uniforms.time.value =
      state.clock.getElapsedTime();
  });

  //gui
  useEffect(() => {
    const gui = getOrCreateGUI();
    let folder: GUI;
    if (!gui) return;

    folder = gui.addFolder("Camera");
    folder.open(true);

    folder
      .add(cameraSettings, "zoomMin")
      .min(0)
      .max(200)
      .onChange((newValue: number) => {
        setCameraSettings((prev) => ({ ...prev, zoomMin: newValue }));
      });
    folder
      .add(cameraSettings, "zoomMax")
      .min(0)
      .max(200)
      .onChange((newValue: number) => {
        setCameraSettings((prev) => ({ ...prev, zoomMax: newValue }));
      });
    folder
      .add(cameraSettings, "rotateSpeed")
      .min(0)
      .max(1)
      .onChange((newValue: number) => {
        setCameraSettings((prev) => ({ ...prev, rotateSpeed: newValue }));
      });
    folder
      .add(cameraSettings, "maxPolarAngle")
      .min(-Math.PI)
      .max(Math.PI)
      .onChange((newValue: number) => {
        setCameraSettings((prev) => ({ ...prev, maxPolarAngle: newValue }));
      });
    folder
      .add(cameraSettings, "zoomSpeed")
      .min(0)
      .max(1)
      .onChange((newValue: number) => {
        setCameraSettings((prev) => ({ ...prev, zoomSpeed: newValue }));
      });

    const skyFolder = gui.addFolder("Sky");
    skyFolder
      .add(skySettings, "turbidity")
      .min(0)
      .max(100)
      .step(1)
      .onChange((newValue: number) => {
        setSkySettings((prev) => ({ ...prev, turbidity: newValue }));
      });
    skyFolder
      .add(skySettings, "mieCoefficient")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange((newValue: number) => {
        setSkySettings((prev) => ({ ...prev, mieCoefficient: newValue }));
      });

    return () => {
      folder.destroy();
      skyFolder.destroy();
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0} />
      <pointLight position={[10, 50, 100]} intensity={10000} />
      <OrbitControls
        enableRotate={cameraSettings.enableRotate}
        enablePan={false}
        enableZoom={cameraSettings.enableZoom}
        maxPolarAngle={cameraSettings.maxPolarAngle}
        minPolarAngle={cameraSettings.minPolarAngle}
        minDistance={cameraSettings.zoomMin}
        maxDistance={cameraSettings.zoomMax}
        rotateSpeed={cameraSettings.rotateSpeed}
        zoomSpeed={cameraSettings.zoomSpeed}
      />
      {/* <Fog /> */}
      <WaterPlane />
      {/* <Sky
        turbidity={skySettings.turbidity}
        mieCoefficient={skySettings.mieCoefficient}
        mieDirectionalG={skySettings.mieDirectionalG}
        sunPosition={[
          skySettings.sunPosition.x,
          skySettings.sunPosition.y,
          skySettings.sunPosition.z,
        ]}
      /> */}
      <mesh position={[0, 20, 0]} rotation={[degToRad(70), degToRad(20), 0]}>
        <sphereGeometry attach="geometry" args={[600, 600]} rotateZ={90} />
        <liquidMaterial
          ref={liquidMaterialRef}
          attach={"material"}
          side={THREE.BackSide}
        />
      </mesh>
      <EffectComposer>
        <Vignette
          offset={0.5}
          darkness={cameraSettings.vignetteDarkness}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
};

export default Environment;

import { OrbitControls } from "@react-three/drei";
import Fog from "./Fog";
import { useEffect, useRef, useState } from "react";
import type GUI from "lil-gui";
import getOrCreateGUI from "./debugUI";
import WaterPlane from "./Water";
import {
  EffectComposer,
  Vignette,
  Bloom
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiquidMaterial from "../LiquidMaterial";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Icosahedron } from "@react-three/drei";
import BackLight from "./BackLight";
import FloatingRocksParticles from "./FloatingRocksParticles";
interface EnvironmentProps {
  bDisableOrbitControls: boolean;
}

const Environment = (props: EnvironmentProps) => {
  const liquidMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const sunRef = useRef<THREE.Mesh>(null!);

  const [cameraSettings, setCameraSettings] = useState({
    zoomMin: 153,
    zoomMax: 200,
    rotateSpeed: 0.25,
    zoomSpeed: 0.1,
    minPolarAngle: Math.PI / 3,
    maxPolarAngle: Math.PI / 2,
    enableZoom: true,
    enableRotate: true,
  });

  const [vignetteDarkness, setVignetteDarkness] = useState(.5);

  const [skySettings, setSkySettings] = useState({
    turbidity: 10,
    mieCoefficient: 0.1,
    mieDirectionalG: 0.95,
    sunPosition: { x: 0.3, y: -0.038, z: -0.95 },
    shaderRepetion: 5.
  });
  const particlePos = [{
    originalPos: { x: 0, y: 0, z: 0 },
    finalPos: { x: 0, y: 100, z: 0 }
  }]

  useEffect(() => {
    console.log("coucou")
  })

  useEffect(() => {
    setCameraSettings((prev) => ({
      ...prev,
      enableZoom: !props.bDisableOrbitControls,
      enableRotate: !props.bDisableOrbitControls,
      zoomMin: props.bDisableOrbitControls ? 0 : 153,
    }));
  }, [props.bDisableOrbitControls]);

  useGSAP(() => {
    const gsapState = { darkness: vignetteDarkness };
    setTimeout(() => {
      gsap.to(gsapState, {
        darkness: props.bDisableOrbitControls ? 2.5 : 0.5,
        duration: 8,
        ease: "power2.in",
        onUpdate() {
          setVignetteDarkness(gsapState.darkness)
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
    skyFolder
      .add(skySettings, "shaderRepetion")
      .min(0)
      .max(100)
      .step(0.1)
      .onChange((newValue: number) => {
        setSkySettings((prev) => ({ ...prev, shaderRepetion: newValue }));
      });

    return () => {
      folder.destroy();
      skyFolder.destroy();
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      {/* <pointLight position={[10, 50, 100]} intensity={200} /> */}
      <BackLight lightRef={sunRef} />
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
      <Fog />
      {/* <WaterPlane /> */}
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
      <Icosahedron args={[600, 1]} material={new THREE.MeshStandardMaterial({ color: "black" })}>
        {/* <liquidMaterial
          ref={liquidMaterialRef}
          attach={"material"}
          side={THREE.BackSide}
          uRepetition={skySettings.shaderRepetion}
        /> */}
      </Icosahedron>
      <FloatingRocksParticles count={1} originalPos={particlePos[0].originalPos} finalPos={particlePos[0].finalPos} />
      <EffectComposer multisampling={0}>
        {/* <GodRays
          sun={sunRef}
          blendFunction={BlendFunction.SCREEN} // The blend function of this effect.
          samples={60} // The number of samples per pixel.
          density={0.96} // The density of the light rays.
          decay={0.9} // An illumination decay factor.
          weight={0.9} // A light ray weight factor.
          exposure={0.6} // A constant attenuation coefficient.
          clampMax={.5} // An upper bound for the saturation of the overall effect.
          kernelSize={KernelSize.SMALL} // The blur kernel size. Has no effect if blur is disabled.
          blur={true} // Whether the god rays should be blurred to reduce artifacts.
          /> */}
        <Bloom
          intensity={.8} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={1} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={.025} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur={true} // Enables or disables mipmap blur.
        />
        <Vignette
          offset={0.5}
          darkness={vignetteDarkness}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
      {/* <mesh position={[0, 20, 0]} rotation={[degToRad(70), degToRad(20), 0]}>
        <sphereGeometry attach="geometry" args={[600, 600]} rotateZ={90} />
        <material
          ref={liquidMaterialRef}
          attach={"material"}
          side={THREE.BackSide}
        />
      </mesh> */}
    </>
  );
};

export default Environment;

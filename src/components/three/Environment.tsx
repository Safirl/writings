import { OrbitControls } from "@react-three/drei";
import Fog from "./Fog";
import { useEffect, useState } from "react";
import type GUI from "lil-gui";
import getOrCreateGUI from "./debugUI";
import WaterPlane from "./Water";
import { Sky } from "@react-three/drei";

const Environment = () => {
  const [cameraSettings, setCameraSettings] = useState({
    zoomMin: 153,
    zoomMax: 200,
    rotateSpeed: 0.25,
    zoomSpeed: 0.1,
    minPolarAngle: Math.PI / 3,
    maxPolarAngle: Math.PI / 2,
  });
  const [skySettings, setSkySettings] = useState({
    turbidity: 10,
    mieCoefficient: 0.1,
    mieDirectionalG: 0.95,
    sunPosition: { x: 0.3, y: -0.038, z: -0.95 },
  });

  useEffect(() => {
    const gui = getOrCreateGUI();
    let folder: GUI;
    if (!gui) return;

    folder = gui.addFolder("Camera");
    folder.open(false);

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

    folder = gui.addFolder("Sky");
    folder
      .add(skySettings, "turbidity")
      .min(0)
      .max(100)
      .step(1)
      .onChange((newValue: number) => {
        setSkySettings((prev) => ({ ...prev, turbidity: newValue }));
      });
    folder
      .add(skySettings, "mieCoefficient")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange((newValue: number) => {
        setSkySettings((prev) => ({ ...prev, mieCoefficient: newValue }));
      });

    return () => folder.destroy();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls
        enablePan={false}
        maxPolarAngle={cameraSettings.maxPolarAngle}
        minPolarAngle={cameraSettings.minPolarAngle}
        minDistance={cameraSettings.zoomMin}
        maxDistance={cameraSettings.zoomMax}
        rotateSpeed={cameraSettings.rotateSpeed}
        zoomSpeed={cameraSettings.zoomSpeed}
      />
      <Fog />
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
    </>
  );
};

export default Environment;

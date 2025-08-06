import type { attach } from "@react-three/fiber/dist/declarations/src/core/utils";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import getGUI from "./debugUI";

const Fog = () => {
  const [fogDensity, setFogDensity] = useState({
    near: 90,
    far: 668,
  });
  useEffect(() => {
    const gui = getGUI();
    if (!gui) return;

    const folder = gui.addFolder("Fog");
    folder
      .add(fogDensity, "near")
      .min(0)
      .max(1000)
      .onChange((newValue: number) => {
        setFogDensity((prev) => ({ ...prev, near: newValue }));
      });
    folder
      .add(fogDensity, "far")
      .min(0)
      .max(1000)
      .onChange((newValue: number) => {
        setFogDensity((prev) => ({ ...prev, far: newValue }));
      });

    return () => folder.destroy();
  }, []);

  const fog = useMemo(
    () => new THREE.Fog("#0f0f0f", fogDensity.near, fogDensity.far),
    [fogDensity]
  );
  return <primitive object={fog} attach="fog" />;
};

export default Fog;

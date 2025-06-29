
import { OrbitControls } from "@react-three/drei";
import Fog from "./Fog";
import { useEffect, useState } from "react";
import type GUI from "lil-gui";
import getOrCreateGUI from "./debugUI";

const Environment = () => {
    const [cameraSettings, setCameraSettings] = useState({ zoomMin: 153, zoomMax: 200, rotateSpeed: .25, zoomSpeed: .1 })

    useEffect(() => {
        const gui = getOrCreateGUI();
        let folder: GUI;
        if (!gui) return;

        folder = gui.addFolder("Camera")

        folder.add(cameraSettings, "zoomMin").min(0).max(200).onChange((newValue: number) => {
            setCameraSettings(prev => ({ ...prev, zoomMin: newValue }))
        });
        folder.add(cameraSettings, "zoomMax").min(0).max(200).onChange((newValue: number) => {
            setCameraSettings(prev => ({ ...prev, zoomMax: newValue }))
        });
        folder.add(cameraSettings, "rotateSpeed").min(0).max(1).onChange((newValue: number) => {
            setCameraSettings(prev => ({ ...prev, rotateSpeed: newValue }))
        });
        folder.add(cameraSettings, "zoomSpeed").min(0).max(1).onChange((newValue: number) => {
            setCameraSettings(prev => ({ ...prev, zoomSpeed: newValue }))
        });

        return () => folder.destroy();
    }, [])

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls
                enablePan={false}
                maxPolarAngle={2 * Math.PI / 3}
                minPolarAngle={Math.PI / 3}
                minDistance={cameraSettings.zoomMin}
                maxDistance={cameraSettings.zoomMax}
                rotateSpeed={cameraSettings.rotateSpeed}
                zoomSpeed={cameraSettings.zoomSpeed}
            />
            <Fog />
        </>
    )
}

export default Environment;

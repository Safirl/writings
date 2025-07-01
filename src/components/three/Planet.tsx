import { useEffect, useRef, useState } from "react";
import getGUI from "./debugUI";
import { useGLTF } from "@react-three/drei";

interface PlanetProps {
    onChangeRadius: (radius: number) => void,
    radius: number
}

const Planet = (props: PlanetProps) => {
    const head = useGLTF("./3D/head.glb")
    const [headDebug, setHeadDebug] = useState({ position: { x: 28, y: -30, z: 0 }, scale: 700, rotation: { rotX: 5.5, rotY: 0, rotZ: Math.PI / 3 } })

    const meshRef = useRef(null!);

    useEffect(() => {
        const gui = getGUI();
        if (!gui) return;

        const folder = gui.addFolder("Head");
        folder?.add(headDebug.position, "y").min(-200).max(200).onChange((newValue: []) => {
            setHeadDebug(prev => ({ ...prev, x: newValue }))
        });
        folder?.add(headDebug.position, "x").min(-200).max(200).onChange((newValue: []) => {
            setHeadDebug(prev => ({ ...prev, x: newValue }))
        });
        folder?.add(headDebug, "scale").min(0).max(800).onChange((newValue: number) => {
            setHeadDebug(prev => ({ ...prev, scale: newValue }))
        });
        folder?.add(headDebug.rotation, "rotZ").min(0).max(2 * Math.PI).onChange((newValue: number) => {
            setHeadDebug(prev => ({ ...prev, rotZ: newValue }))
        });
        folder?.add(headDebug.rotation, "rotX").min(0).max(2 * Math.PI).onChange((newValue: number) => {
            setHeadDebug(prev => ({ ...prev, rotX: newValue }))
        });

        return () => folder.destroy();
    }, [])

    return (
        <>
            <primitive object={head.scene} scale={headDebug.scale} position={[headDebug.position.x, headDebug.position.y, headDebug.position.z]} rotation={[headDebug.rotation.rotX, headDebug.rotation.rotY, headDebug.rotation.rotZ]} />
            {/* <mesh ref={meshRef}>
                <sphereGeometry args={[props.radius, 32, 32]} />
                <meshStandardMaterial color={"white"} wireframe />
            </mesh> */}
        </>
    )
}

export default Planet;
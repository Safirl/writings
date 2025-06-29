import { useEffect, useRef } from "react";
import getGUI from "./debugUI";

interface PlanetProps {
    onChangeRadius: (radius: number) => void,
    radius: number
}

const Planet = (props: PlanetProps) => {
    const meshRef = useRef(null!);

    useEffect(() => {
        const gui = getGUI();
        if (!gui) return;

        const folder = gui.addFolder("Planet");

        return () => folder.destroy();
    }, [])

    return (
        <>
            <mesh ref={meshRef}>
                <sphereGeometry args={[props.radius, 32, 32]} />
                <meshStandardMaterial color={"white"} wireframe />
            </mesh>
        </>
    )
}

export default Planet;
import { useEffect, useRef, useState } from "react";
import getOrCreateGUI from "./debugUI";
import GUI from "lil-gui";
import * as THREE from "three"

export interface InteractiveCardProps {
    planetRadius: number,
    angle: { theta: number, phi: number },
}

const InteractiveCard = (props: InteractiveCardProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [angle, setAngle] = useState<{ theta: number, phi: number }>({ theta: 0, phi: 0 })

    useEffect(() => {
        if (!meshRef.current) return;
        setPositionAndRotation(angle.theta, angle.phi)
    }, [angle])

    useEffect(() => {
        //Setup GUI
        const gui = getOrCreateGUI();
        let folder: GUI;
        if (!gui || !meshRef.current) return;

        folder = gui.addFolder("InteractiveCard")

        setAngle(props.angle)

        folder?.add(props.angle, "theta").min(-3.14).max(3.14).onChange((newValue: number) => {
            setAngle(prev => ({ ...prev, theta: newValue }))
        });
        folder?.add(props.angle, "phi").min(-3.14).max(3.14).onChange((newValue: number) => {
            setAngle(prev => ({ ...prev, phi: newValue }))
        });

        return () => folder.destroy();
    }, [props.planetRadius, props.angle])

    const setPositionAndRotation = (newTheta: number, newPhi: number) => {
        if (!meshRef.current) return;

        const newPosition = calculatePosition(newTheta, newPhi);

        // Mettre à jour la position de la card
        meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);

        const planetCenter = new THREE.Vector3(0, 0, 0);
        meshRef.current.lookAt(planetCenter);
    }

    const calculatePosition = (newTheta: number, newPhi: number) => {
        //  theta: Angle autour de l'axe Y (angle theta de x vers z) 
        // ---->x
        // |
        // v z

        //  phi: Angle autour de l'axe Z (angle phi de x vers y) 
        // ^ y
        // |
        // ---->x
        const theta = newTheta //Math.PI / 180 * thetaStep * 360
        const phi = newPhi //Math.PI / 180 * phiStep * 360;

        return {
            x: props.planetRadius * Math.cos(phi) * Math.cos(theta),
            y: props.planetRadius * Math.sin(phi),
            z: props.planetRadius * Math.cos(phi) * Math.sin(theta)
        };
    }
    return (
        <>
            <mesh ref={meshRef}>
                <planeGeometry args={[2, 2]} />
                <meshStandardMaterial color={"red"} args={[]} side={THREE.DoubleSide} />
            </mesh>
        </>
    )

}

export default InteractiveCard;
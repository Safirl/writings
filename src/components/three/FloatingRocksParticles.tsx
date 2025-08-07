import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"

interface particlesProps {
    count: number;
}

const FloatingRocksParticles = (props: particlesProps) => {
    const { count } = props;

    // This reference gives us direct access to our points
    const points = useRef<THREE.Points>(null!);

    // Generate our positions attributes array
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const distance = 100;

        for (let i = 0; i < count; i++) {

            // const theta = THREE.MathUtils.randFloatSpread(360);
            // const phi = THREE.MathUtils.randFloatSpread(360);

            // let x = distance * Math.sin(theta) * Math.cos(phi)
            // let y = distance * Math.sin(theta) * Math.sin(phi);
            // let z = distance * Math.cos(theta);
            let x = 0;
            let y = 0;
            let z = 0;

            positions.set([x, y, z], i * 3);
        }


        return positions;
    }, [count]);

    useFrame((state) => {
        const { clock } = state;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;


            // points.current.geometry.attributes.position.array[i3] += Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
            // points.current.geometry.attributes.position.array[i3 + 1] += Math.cos(clock.elapsedTime + Math.random() * 10) * 0.01;
            // points.current.geometry.attributes.position.array[i3 + 2] += Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
            points.current.geometry.attributes.position.array[i3 + 1] += Math.cos(clock.elapsedTime) + .5
        }

        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    args={[particlesPosition, 3]}
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={10} color="#5786F5" sizeAttenuation depthWrite={true} />
        </points>
    )
}

export default FloatingRocksParticles;
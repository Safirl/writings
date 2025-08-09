import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"

interface particlesProps {
    count: number;
    originalPos: { x: number, y: number, z: number }
    finalPos: { x: number, y: number, z: number }
}

const FloatingRocksParticles = (props: particlesProps) => {
    const { count, originalPos, finalPos } = props;

    const points = useRef<THREE.Points>(null!);
    const materialRef = useRef<THREE.PointsMaterial>(null!);

    const startTimesRef = useRef<Float32Array>(new Float32Array(count));
    const durationsRef = useRef<Float32Array>(new Float32Array(count));

    // Generate our positions attributes array
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3

            positions[i3] = originalPos.x;
            positions[i3 + 1] = originalPos.y;
            positions[i3 + 2] = originalPos.z;

            // Temps de départ relatif (en secondes depuis le début)
            startTimesRef.current[i] = Math.random() * 5;
            durationsRef.current[i] = 3 + Math.random() * 2;
        }
        return positions;
    }, [count, originalPos, finalPos]);

    useFrame((state) => {
        const { clock } = state;
        const currentTime = clock.getElapsedTime();

        // Temps relatif depuis le début de l'animation
        const positions = points.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const particleStartTime = startTimesRef.current[i];
            const localTime = currentTime - particleStartTime;

            // Si l'animation n'a pas encore commencé
            if (localTime < 0) {
                positions[i3] = originalPos.x;
                positions[i3 + 1] = originalPos.y;
                positions[i3 + 2] = originalPos.z;
                continue;
            }

            const duration = durationsRef.current[i];
            const t = localTime / duration;

            // Si l'animation est terminée, reset
            if (t >= 1) {
                positions[i3] = originalPos.x;
                positions[i3 + 1] = originalPos.y;
                positions[i3 + 2] = originalPos.z;
                // Programmer le prochain cycle
                startTimesRef.current[i] = currentTime + Math.random() * 2;
                continue;
            }

            // Animation en cours
            positions[i3 + 1] = THREE.MathUtils.lerp(originalPos.y, finalPos.y, t);
            positions[i3 + 0] = originalPos.x + Math.sin(t * Math.PI * 2 + i) * 2;
            positions[i3 + 2] = originalPos.z + Math.cos(t * Math.PI * 2 + i) * 2;
        }

        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={points} userData={{ noReflection: true }} visible={false}>
            <bufferGeometry>
                <bufferAttribute
                    args={[particlesPosition, 3]}
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial ref={materialRef} size={5} color="#5786F5" sizeAttenuation={false} depthWrite={true} />
        </points>
    )
}

export default FloatingRocksParticles;
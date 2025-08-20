import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"
import getOrCreateGUI from "./debugUI";
import GUI from "lil-gui";

interface particlesProps {
    id: number
    count: number;
    originalPos: { x: number, y: number, z: number }
    finalPos: { x: number, y: number, z: number }
    colorMap: THREE.Texture
}

const FloatingRocksParticles = (props: particlesProps) => {
    const { count, originalPos, finalPos, id, colorMap } = props;

    const [particleSize, setParticleSize] = useState({ size: 5 })
    const [particleSpeed, setParticleSpeed] = useState({ speed: 20 })

    const points = useRef<THREE.Points>(null!);
    const materialRef = useRef<THREE.PointsMaterial>(null!);

    const startTimesRef = useRef<Float32Array>(new Float32Array(count));
    const durationsRef = useRef<Float32Array>(new Float32Array(count));

    //gui
    useEffect(() => {
        const gui = getOrCreateGUI();
        let folder: GUI;
        if (!gui || id != 0) return;

        folder = gui.addFolder("Particles");
        folder.open(true);

        folder
            .add(particleSize, "size")
            .min(0)
            .max(20)
            .onChange((newValue: number) => {
                setParticleSize((prev) => ({ ...prev, size: newValue }));
            });
        folder
            .add(particleSpeed, "speed")
            .min(0)
            .max(20)
            .onChange((newValue: number) => {
                setParticleSpeed((prev) => ({ ...prev, speed: newValue }));
            });
    }, [])

    // Generate buffer arrays
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 4)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3

            positions[i3] = originalPos.x;
            positions[i3 + 1] = originalPos.y;
            positions[i3 + 2] = originalPos.z;

            // Temps de départ relatif (en secondes depuis le début)
            startTimesRef.current[i] = Math.random() * 5;
            durationsRef.current[i] = particleSpeed.speed + Math.random() * 2;
            const i4 = i * 4;
            colors[i4] = 1;
            colors[i4 + 1] = 1;
            colors[i4 + 2] = 1;
            colors[i4 + 3] = 1;
        }

        return { positions, colors };
    }, [count, originalPos, finalPos, particleSpeed.speed]);

    useFrame((state) => {
        const { clock } = state;
        const currentTime = clock.getElapsedTime();

        // Temps relatif depuis le début de l'animation
        const positions = points.current.geometry.attributes.position.array as Float32Array;
        const colors = points.current.geometry.attributes.color.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const i4 = i * 4;
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

            const fadeInStart = 0.0;
            const fadeInEnd = 0.2;
            const fadeOutStart = 0.7;
            const fadeOutEnd = 1.0;

            let alpha = 1;

            if (t < fadeInEnd) {
                alpha = (t - fadeInStart) / (fadeInEnd - fadeInStart);
            }
            else if (t > fadeOutStart) {
                alpha = 1 - (t - fadeOutStart) / (fadeOutEnd - fadeOutStart);
            }

            alpha = THREE.MathUtils.clamp(alpha, 0, 1);

            colors[i4 + 3] = alpha;

            if (t >= 1) {
                positions[i3] = originalPos.x;
                positions[i3 + 1] = originalPos.y;
                positions[i3 + 2] = originalPos.z;

                startTimesRef.current[i] = currentTime + Math.random() * 2;
                continue;
            }

            // Animation en cours
            positions[i3 + 1] = THREE.MathUtils.lerp(originalPos.y, finalPos.y, t);
            positions[i3 + 0] = originalPos.x + Math.sin(t * Math.PI * 2 + i) * 2;
            positions[i3 + 2] = originalPos.z + Math.cos(t * Math.PI * 2 + i) * 2;
        }

        points.current.geometry.attributes.position.needsUpdate = true;
        points.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <points ref={points} userData={{ noReflection: true }} visible={false}>
            <bufferGeometry>
                <bufferAttribute
                    args={[particlesPosition.positions, 3]}
                    attach="attributes-position"
                    count={particlesPosition.positions.length / 3}
                    array={particlesPosition.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    args={[particlesPosition.colors, 4]}
                    attach="attributes-color"
                    count={particlesPosition.colors.length / 4}
                    array={particlesPosition.colors}
                    itemSize={4}
                />
            </bufferGeometry>
            <pointsMaterial map={colorMap} ref={materialRef} size={particleSize.size} transparent={true} alphaMap={colorMap} sizeAttenuation={true} depthWrite={true} vertexColors />
        </points>
    )
}

export default FloatingRocksParticles;
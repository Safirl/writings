import { useMemo, useRef, useState } from "react";
import * as THREE from "three"

interface particlesProps {
    count: number;
    colorMap: THREE.Texture
}

const DustParticles = (props: particlesProps) => {
    const { count, colorMap } = props
    const points = useRef<THREE.Points>(null!);
    const materialRef = useRef<THREE.PointsMaterial>(null!);
    const [particleSize, setParticleSize] = useState({ size: 3 })

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 500
        }

        return { positions };
    }, [count]);


    return (
        <points ref={points} userData={{ noReflection: true }} visible={false} >
            <bufferGeometry>
                <bufferAttribute
                    args={[particlesPosition.positions, 3]}
                    attach="attributes-position"
                    count={particlesPosition.positions.length / 3}
                    array={particlesPosition.positions}
                    itemSize={3}
                />
                {/* <bufferAttribute
                    args={[particlesPosition.colors, 4]}
                    attach="attributes-color"
                    count={particlesPosition.colors.length / 4}
                    array={particlesPosition.colors}
                    itemSize={4}
                /> */}
            </bufferGeometry>
            <pointsMaterial map={colorMap} ref={materialRef} size={particleSize.size} transparent={true} alphaMap={colorMap} sizeAttenuation={true} depthWrite={true} />
        </points >
    )
}

export default DustParticles;
import { useEffect, useRef, type ForwardedRef } from "react";
import * as THREE from "three"
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";
import LiquidMaterial from "../LiquidMaterial";
import { useFrame } from "@react-three/fiber";
import { color } from "three/tsl";
import { Plane, Sphere } from "@react-three/drei";
import { GodRays } from '@react-three/postprocessing';

interface backLightProps {
    lightRef: ForwardedRef<THREE.Mesh>
}

const BackLight = (props: backLightProps) => {
    // const liquidMaterialRef = useRef<THREE.RectAreaLight>(null!);

    // useEffect(() => {
    //     if (!lightRef.current) return;

    //     const helper = new RectAreaLightHelper(lightRef.current);
    //     lightRef.current.add(helper);

    //     return () => {
    //         lightRef.current.remove(helper);
    //         helper.dispose?.();
    //     };
    // }, []);

    // useFrame((state) => {
    //     if (!liquidMaterialRef.current) return;
    //     liquidMaterialRef.current.uniforms.time.value =
    //         state.clock.getElapsedTime();
    // });

    return (
        <>
            <group position={[5, 50, -500]} scale={[1, 1, 1]} rotation={[0, Math.PI, 0]} >
                <rectAreaLight intensity={5} color={"white"} width={200} height={(500)} />
                <Plane ref={props.lightRef} args={[200, 500, 200, 200]} material={new THREE.MeshStandardMaterial({ color: "white", fog: false, transparent: true, emissive: "white", emissiveIntensity: 2, toneMapped: false })} rotation={[0, Math.PI, 0]} >
                    {/* <liquidMaterial ref={liquidMaterialRef} uRepetition={5.} /> */}
                </Plane>
            </group>
        </>
    )
}

export default BackLight
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/Addons.js";

const WaterPlane = () => {
    const ref = useRef<THREE.Mesh>(null!);
    const waterRef = useRef<Water>(null!);
    const normalMap = useLoader(THREE.TextureLoader, "textures/waterNormal.jpg");
    const scene = useThree((state) => state.scene);

    const [waterDebugObject, setWaterDebugObject] = useState({});

    useEffect(() => {
        if (!ref.current) return;

        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;

        const planeGeometry = new THREE.CircleGeometry(1000);

        const water = new Water(planeGeometry, {
            textureHeight: 512,
            textureWidth: 512,
            waterNormals: normalMap,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 1,
            fog: scene.fog !== undefined,
            // alpha: .8
        });

        water.rotation.x = -Math.PI / 2;
        water.position.y = -5;

        water.traverse(obj => {
            if (obj) {
                const oldBefore = obj.onBeforeRender;
                const oldAfter = obj.onAfterRender;

                obj.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                    hideParticles();
                    if (oldBefore) oldBefore(renderer, scene, camera, geometry, material, group);
                };

                obj.onAfterRender = (renderer, scene, camera, geometry, material, group) => {
                    showParticles();
                    if (oldAfter) oldAfter(renderer, scene, camera, geometry, material, group);
                };
            }
        });


        const hideParticles = () => {
            scene.traverse(obj => {
                if (obj.userData.noReflection) {
                    obj.visible = false;
                }
            });
        };
        const showParticles = () => {
            scene.traverse(obj => {
                if (obj.userData.noReflection) obj.visible = true;
            });
        };

        ref.current.add(water);
        waterRef.current = water;
    }, [normalMap]);

    useFrame((_, delta) => {
        if (!waterRef.current) return;
        waterRef.current.material.uniforms.time.value += delta;
    });

    return <group ref={ref} />;
};

export default WaterPlane;

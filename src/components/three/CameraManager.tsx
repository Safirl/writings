import { useThree } from "@react-three/fiber"
import { useGSAP } from "@gsap/react"
import * as THREE from "three"
import { useEffect } from "react"
import gsap from "gsap"

export interface animationObject {
    targetPosition: THREE.Vector3
    targetRotation?: THREE.Euler
    delay: number
    duration: number
    ease: string
    onComplete?: () => void
}

interface cameraManagerProps {
    animationObject: animationObject
}

const CameraManager = (props: cameraManagerProps) => {
    const { camera } = useThree()
    let obj = props.animationObject

    useGSAP(() => {
        if (!obj || !obj.targetPosition || obj.duration == undefined || obj.ease == undefined) return;

        setTimeout(() => {
            gsap.to(camera.position, {
                x: obj.targetPosition.x,
                y: obj.targetPosition.y,
                z: obj.targetPosition.z,
                duration: obj.duration / 1000,
                ease: obj.ease,
                onComplete: () => {
                    if (props.animationObject.onComplete)
                        props.animationObject.onComplete()
                },
            });
            if (obj.targetRotation) {
                gsap.to(camera.rotation, {
                    x: obj.targetRotation.x,
                    y: obj.targetRotation.y,
                    z: obj.targetRotation.z,
                    duration: obj.duration / 1000,
                    ease: obj.ease,
                });
            }
        }, obj.delay);
    }, [props])

    return null
}

export default CameraManager
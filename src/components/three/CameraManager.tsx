import { useThree } from "@react-three/fiber"
import { useGSAP } from "@gsap/react"
import * as THREE from "three"
import { useEffect } from "react"
import gsap from "gsap"

export interface animationObject {
    targetPosition: THREE.Vector3
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
    const obj = props.animationObject

    useGSAP(() => {
        if (!obj || !obj.targetPosition || obj.duration == undefined || obj.ease == undefined) return;

        setTimeout(() => {
            gsap.to(camera.position, {
                x: obj.targetPosition.x,
                y: obj.targetPosition.y,
                z: obj.targetPosition.z,
                duration: obj.duration,
                ease: obj.ease,
                onComplete: () => {
                    if (props.animationObject.onComplete)
                        props.animationObject.onComplete()
                },
            });
        }, obj.delay);
    }, [props])

    return null
}

export default CameraManager
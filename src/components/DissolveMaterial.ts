import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";

declare module "@react-three/fiber" {
    interface ThreeElements {
        dissolveMaterial: ThreeElement<typeof DissolveMaterial>;
    }
}

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    uniform sampler2D uNoiseTexture;
    uniform float uDissolve;
    uniform vec3 uEdgeColor;
    varying vec2 vUv;

    void main() {
        float noise = texture2D(uNoiseTexture, vUv).r;
        vec4 color = texture2D(uTexture, vUv);
        float edgeWidth = 0.1;

        if (noise < uDissolve) {
            gl_FragColor = color;
        } else if (noise < uDissolve + edgeWidth) {
            gl_FragColor = vec4(uEdgeColor, 1.0);
        } else {
            discard;
        }
    }
`;

const DissolveMaterial = shaderMaterial(
    {
        uTexture: new THREE.Texture(),
        uNoiseTexture: new THREE.Texture(),
        uDissolve: 0.0,
        uEdgeColor: new THREE.Color(0x000000),
    },
    vertexShader,
    fragmentShader
);

extend({ DissolveMaterial });

export default DissolveMaterial;

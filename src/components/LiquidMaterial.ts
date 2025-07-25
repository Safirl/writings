import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    liquidMaterial: ThreeElement<typeof LiquidMaterial>;
  }
}

const vertexShader = `
    varying vec3 vNormal;
    void main() {
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vNormal;
    uniform sampler2D uTexture;
    uniform vec3 uCol;
    uniform float time;

    void main() {
        vec3 n = normalize(vNormal);
        vec2 locUv = vec2(
            atan(n.z, n.x) / 3.14159,
            acos(n.y) / 3.14159
        );

        locUv *= 6.5;
    
        float len;
        for(int i = 0; i < 3; i++) {
            len = length(locUv);
            locUv.x +=  sin(locUv.y + time * 0.3)*5.;
            locUv.y +=  cos(locUv.x + time * 0.1 + cos(len * 2.0))*2.;
        }
        
        vec3 col = vec3(cos(len + 0.3), cos(len + 0.1), cos(len - 0.1));
        
        gl_FragColor = vec4(col,1.0);
    }
`;

const LiquidMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uCol: new THREE.Color("white"),
    time: { value: 0 },
  },
  vertexShader,
  fragmentShader
);

extend({ LiquidMaterial });

export default LiquidMaterial;

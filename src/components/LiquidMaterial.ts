import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    liquidMaterial: ThreeElement<typeof LiquidMaterial>;
  }
}

const vertexShader = `
    varying vec3 vWorldNormal;
    void main() {
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
  varying vec3 vWorldNormal;
  uniform float time;
  uniform float uRepetition;

  vec3 palette( in float t)
  {
    // Palette : [[0.800, 0.063, 0.227] [0.639, 0.122, 0.318] [0.235, 0.020, 0.255] [0.145, 0.024, 0.251] [0.000, 0.067, 0.106]]
    vec3 a = vec3(0, 0, 0);
    vec3 b = vec3(0.1, 0, 0);
    vec3 c = vec3(0.235, 0.020, 0.255);
    vec3 d = vec3(0.145, 0.024, 0.251);

    return a + b*cos( 6.28318*(c*t) );
  }

  void main() {
    vec3 n = normalize(vWorldNormal);
    vec2 uv = vec2(
        atan(n.z, n.x) / 3.14159,
        acos(n.y) / 3.14159
    );
    uv *= uRepetition;


    vec3 col = vec3(0.0);
    float t = time;

    float len;
    for(float i = 0.; i < 3.; i++) {
        len = length(uv);
        uv.x +=  sin(uv.y + t * 0.3)*1.;
        uv.y +=  cos(uv.x + t * 0.1 + cos(len * 2.0))*1.;
        col = palette(length(uv) + i*.4 + t * .2);
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const LiquidMaterial = shaderMaterial(
  {
    uRepetition: 5.,
    time: { value: 0 },
  },
  vertexShader,
  fragmentShader,
);

extend({ LiquidMaterial });

export default LiquidMaterial;

import { useEffect, useRef, useState } from "react";
import getOrCreateGUI from "./debugUI";
import GUI from "lil-gui";
import * as THREE from "three";
import DissolveMaterial from "../DissolveMaterial";

export interface InteractiveCardProps {
  planetRadius: number;
  angle: { theta: number; phi: number };
  id: number;
  text: string;
  imgURL: string;
}

function createCardtexture(
  text: string,
  imgURL: string
): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d")!;

    const image = new Image();
    image.src = imgURL;

    image.onload = () => {
      ctx.fillStyle = "#0F0F0F";

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      ctx.fillRect(0, 384 - 64, canvas.width, 64);

      ctx.fillStyle = "white";
      ctx.font = "32px Junicode";
      ctx.fillText(text, 16, 384 - 24);
      resolve(canvas);
    };
  });
}

const InteractiveCard = (props: InteractiveCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.Material>(null!);
  const [angle, setAngle] = useState<{ theta: number; phi: number }>({
    theta: 0,
    phi: 0,
  });
  const [radiusDelta, setRadiusDelta] = useState<{ delta: number }>({
    delta: 2,
  });
  const [texture, setTexture] = useState<THREE.Texture | null>();

  useEffect(() => {
    createCardtexture(props.text, props.imgURL).then((canvas) => {
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      setTexture(texture);
    });
  }, [props.text, props.imgURL]);

  useEffect(() => {
    if (!meshRef.current) return;
    setPositionAndRotation(angle.theta, angle.phi);
  }, [angle, radiusDelta.delta, texture]);

  useEffect(() => {
    //Setup GUI
    if (!meshRef.current) return;
    setAngle(props.angle);
    const gui = getOrCreateGUI();
    let folder: GUI;
    if (!gui || props.id !== 0) return;

    folder = gui.addFolder("InteractiveCard");

    folder
      ?.add(props.angle, "theta")
      .min(-3.14)
      .max(3.14)
      .onChange((newValue: number) => {
        setAngle((prev) => ({ ...prev, theta: newValue }));
      });
    folder
      ?.add(props.angle, "phi")
      .min(-Math.PI)
      .max(Math.PI)
      .onChange((newValue: number) => {
        setAngle((prev) => ({ ...prev, phi: newValue }));
      });
    folder
      ?.add(radiusDelta, "delta")
      .min(0)
      .max(5)
      .onChange((newValue: number) => {
        setRadiusDelta({ delta: newValue });
      });

    return () => folder.destroy();
  }, [props.planetRadius, props.angle, texture]);

  const setPositionAndRotation = (newTheta: number, newPhi: number) => {
    if (!meshRef.current) return;

    const newPosition = calculatePosition(newTheta, newPhi);

    // Mettre à jour la position de la card
    meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);

    const planetCenter = new THREE.Vector3(0, 0, 0);
    meshRef.current.lookAt(planetCenter);
    meshRef.current.rotateY(Math.PI);
  };

  const calculatePosition = (newTheta: number, newPhi: number) => {
    //  theta: Angle autour de l'axe Y (angle theta de x vers z)
    // ---->x
    // |
    // v z

    //  phi: Angle autour de l'axe Z (angle phi de x vers y)
    // ^ y
    // |
    // ---->x
    const theta = newTheta; //Math.PI / 180 * thetaStep * 360
    const phi = newPhi; //Math.PI / 180 * phiStep * 360;

    return {
      x:
        (props.planetRadius + radiusDelta.delta) *
        Math.cos(phi) *
        Math.cos(theta),
      y: (props.planetRadius + radiusDelta.delta) * Math.sin(phi),
      z:
        (props.planetRadius + radiusDelta.delta) *
        Math.cos(phi) *
        Math.sin(theta),
    };
  };

  if (!texture) {
    return null;
  } else {
    return (
      <group ref={meshRef}>
        <mesh>
          <planeGeometry args={[32, 24]} />
          <DissolveMaterial
            ref={materialRef}
            side={THREE.FrontSide}
            uTexture={texture}
            uNoiseTexture={}
          />
        </mesh>
        <mesh>
          <planeGeometry args={[32, 24]} />
          <meshStandardMaterial color="#0F0F0F" side={THREE.BackSide} />
        </mesh>
      </group>
    );
  }
};

export default InteractiveCard;

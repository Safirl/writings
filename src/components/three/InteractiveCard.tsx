import { useEffect, useRef, useState } from "react";
import getOrCreateGUI from "./debugUI";
import GUI from "lil-gui";
import * as THREE from "three";
import ColorThief from "colorthief";
import DissolveMaterial from "../DissolveMaterial";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useThree, type Camera, type ThreeEvent } from "@react-three/fiber";

interface InteractiveCardProps {
  planetRadius: number;
  angle: { theta: number; phi: number };
  id: number;
  text: string;
  imgURL: string;
  onCardClicked: () => void;
}

interface TextureLoadingState {
  texture: THREE.Texture | null;
  noiseTexture: THREE.Texture | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

function createCardtexture(
  text: string,
  imgURL: string
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Can't create canvas context"));
      return;
    }

    const image = new Image();

    // Gestion d'erreur de chargement d'image
    image.onerror = () => {
      reject(new Error(`Can't load image: ${imgURL}`));
    };

    // Timeout pour éviter les chargements infinis
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout for image: ${imgURL}`));
    }, 10000);

    image.onload = () => {
      clearTimeout(timeout);

      try {
        ctx.fillStyle = "#0F0F0F";
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 384 - 64, canvas.width, 64);
        ctx.fillStyle = "white";
        ctx.font = "32px Junicode";
        ctx.fillText(text, 16, 384 - 24);
        resolve(canvas);
      } catch (error) {
        reject(new Error(`Error when creating texture: ${error}`));
      }
    };

    image.src = imgURL;
  });
}

function loadNoiseTexture(): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();

    const timeout = setTimeout(() => {
      reject(new Error("Timeout when loading noise texture"));
    }, 10000);

    loader.load(
      "./textures/noiseTexture.png",
      (texture) => {
        clearTimeout(timeout);
        resolve(texture);
      },
      undefined, // onProgress
      (error) => {
        clearTimeout(timeout);
        reject(new Error(`Can't load noise texture: ${error}`));
      }
    );
  });
}

const InteractiveCard = (props: InteractiveCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.Material>(null!);
  const { camera } = useThree();

  const [angle, setAngle] = useState<{ theta: number; phi: number }>({
    theta: 0,
    phi: 0,
  });

  const [radiusDelta, setRadiusDelta] = useState<{ delta: number }>({
    delta: 2,
  });

  const [textureState, setTextureState] = useState<TextureLoadingState>({
    texture: null,
    noiseTexture: null,
    isLoading: true,
    hasError: false,
  });

  const [edgeColor, setEdgeColor] = useState("");
  const [dissolveStep, setDissolveStep] = useState({ step: 0 });

  const { contextSafe } = useGSAP();

  const onCardHovered = contextSafe(() => {
    document.body.style.cursor = "pointer";
    const gsapState = { delta: radiusDelta.delta };
    gsap.to(gsapState, {
      delta: 6,
      duration: 1,
      ease: "power2.out",
      onUpdate() {
        setRadiusDelta({ delta: gsapState.delta });
      },
    });
  });

  const onCardUnhovered = contextSafe(() => {
    document.body.style.cursor = "auto";
    const gsapState = { delta: radiusDelta.delta };
    gsap.to(gsapState, {
      delta: 2,
      duration: 1,
      ease: "power2.out",
      onUpdate() {
        setRadiusDelta({ delta: gsapState.delta });
      },
    });
  });

  const onCardClicked = contextSafe(() => {
    if (!meshRef.current || !camera) return;
    //notify the parent that the card has been clicked
    props.onCardClicked();

    const forward = new THREE.Vector3();
    meshRef.current.getWorldDirection(forward);
    let targetPosition = new THREE.Vector3();
    targetPosition = meshRef.current.position
      .clone()
      .add(forward.multiplyScalar(50));

    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 3,
      ease: "sine.inOut",
      onComplete: () => {
        zoomAnimation();
      },
    });
  });

  const zoomAnimation = contextSafe(() => {
    if (!meshRef.current || !camera) return;

    const forward = new THREE.Vector3();
    meshRef.current.getWorldDirection(forward);
    let targetPosition = new THREE.Vector3();
    targetPosition = meshRef.current.position
      .clone()
      .add(forward.multiplyScalar(30));

    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 3,
      ease: "sine.inOut",
    });
  });

  //Dissolve animation
  useGSAP(() => {
    if (!textureState.texture || !textureState.noiseTexture) return;

    const gsapState = { step: 0 };
    gsap.to(gsapState, {
      step: 1,
      duration: 2,
      ease: "power2.out",
      onUpdate() {
        setDissolveStep({ step: gsapState.step });
      },
    });
  }, [textureState.texture, textureState.noiseTexture]);

  // Load textures
  useEffect(() => {
    //avoid memory leaks
    let isMounted = true;

    setTextureState((prev) => ({ ...prev, isLoading: true, hasError: false }));

    const loadTextures = async () => {
      try {
        // Load textures
        const [canvas, noiseTexture] = await Promise.all([
          createCardtexture(props.text, props.imgURL),
          loadNoiseTexture(),
        ]);

        if (!isMounted) return;

        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.needsUpdate = true;

        setTextureState({
          texture: canvasTexture,
          noiseTexture: noiseTexture,
          isLoading: false,
          hasError: false,
        });
      } catch (error) {
        console.error("Error when loading textures:", error);

        if (!isMounted) return;

        setTextureState({
          texture: null,
          noiseTexture: null,
          isLoading: false,
          hasError: true,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    loadTextures();

    return () => {
      isMounted = false;
    };
  }, [props.text, props.imgURL]);

  //Set angle
  useEffect(() => {
    setAngle(props.angle);
  }, [props.angle]);

  // Set card transform
  useEffect(() => {
    if (textureState.texture && !textureState.hasError) {
      setPositionAndRotation(angle.theta, angle.phi);
    }
  }, [angle, radiusDelta.delta, textureState.texture]);

  // GUI
  useEffect(() => {
    if (props.id != 0 || !meshRef.current || !textureState.texture) return;

    console.log("creating gui");
    const gui = getOrCreateGUI();
    if (!gui) return;

    const folder = gui.addFolder("InteractiveCard");

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

    folder
      ?.add(dissolveStep, "step")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange((newValue: number) => {
        setDissolveStep({ step: newValue });
      });

    return () => folder.destroy();
  }, [
    props.planetRadius,
    props.angle,
    textureState.texture,
    // radiusDelta,
    // dissolveStep,
  ]);

  const setPositionAndRotation = (newTheta: number, newPhi: number) => {
    if (!meshRef.current) return;

    const newPosition = calculatePosition(newTheta, newPhi);
    meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);

    const planetCenter = new THREE.Vector3(0, 0, 0);
    meshRef.current.lookAt(planetCenter);
    meshRef.current.rotateY(Math.PI);
  };

  const calculatePosition = (newTheta: number, newPhi: number) => {
    const theta = newTheta;
    const phi = newPhi;

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

  // Debug
  if (textureState.isLoading) {
    return null;
  }

  if (textureState.hasError) {
    console.error(
      `InteractiveCard Error: ${props.id}:`,
      textureState.errorMessage
    );
    return null;
  }

  if (!textureState.texture || !textureState.noiseTexture) {
    return null;
  }

  return (
    <group
      ref={meshRef}
      onPointerEnter={onCardHovered}
      onPointerLeave={onCardUnhovered}
      onClick={onCardClicked}
    >
      <mesh>
        <planeGeometry args={[32, 24]} />
        <dissolveMaterial
          ref={materialRef}
          side={THREE.FrontSide}
          uTexture={textureState.texture}
          uNoiseTexture={textureState.noiseTexture}
          uEdgeColor={edgeColor}
          uDissolve={dissolveStep.step}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[32, 24]} />
        <meshStandardMaterial color="#0F0F0F" side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

export default InteractiveCard;

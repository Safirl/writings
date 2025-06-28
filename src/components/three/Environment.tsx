
import { OrbitControls } from "@react-three/drei";
import Fog from "./Fog";

const Environment = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls />
            <Fog />
        </>
    )
}

export default Environment;
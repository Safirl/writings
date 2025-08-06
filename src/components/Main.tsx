import "../styles/reset.scss";
import "../styles/globals.scss";
import Welcome from "./Welcome";
import SceneCanvas from "./three/SceneCanvas";
import { useState } from "react";

const Main = () => {
  const [bDisplayWelcome, setDisplayWelcome] = useState(true);
  function handleEnterClick() {
    setDisplayWelcome(false);
  }

  return (
    <>
      {bDisplayWelcome ? (
        <Welcome onEnterClicked={handleEnterClick} />
      ) : (
        <SceneCanvas />
      )}
    </>
  );
};

export default Main;

import "../styles/reset.scss";
import "../styles/globals.scss";
import Welcome from "./Welcome";
import SceneCanvas from "./three/SceneCanvas";
import { useState } from "react";
import Project from "./Project";

const Main = () => {
  const [bDisplayWelcome, setDisplayWelcome] = useState(true);
  const [currentId, setCurrentId] = useState<number>(0)

  function handleEnterClick() {
    setDisplayWelcome(false);
  }

  const displayCardContent = (id: number) => {
    setCurrentId(id)
  }

  const onBackButtonPressed = () => {
    console.log("back button pressed")
  }

  return (
    <>
      {bDisplayWelcome ? (
        <Welcome onEnterClicked={handleEnterClick} />
      ) : (
        <SceneCanvas onDisplayCardContent={displayCardContent} />
      )}
      {currentId != null && <Project id={currentId} onBackButtonPressed={onBackButtonPressed}></Project>}
    </>
  );
};

export default Main;

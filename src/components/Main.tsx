import "../styles/reset.scss";
import "../styles/globals.scss";
import Welcome from "./Welcome";
import SceneCanvas from "./three/SceneCanvas";
import projects from "../data/projects";
import { useState } from "react";

const Main = () => {
  const [bDisplayWelcome, setDisplayWelcome] = useState(true);
  function handleEnterClick() {
    console.log("coucou");
    setDisplayWelcome(false);
  }

  return (
    <>
      {bDisplayWelcome ? (
        <Welcome onEnterClicked={handleEnterClick} />
      ) : (
        <SceneCanvas projects={projects} />
      )}
    </>
  );
};

export default Main;

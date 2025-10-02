import "../styles/reset.scss";
import "../styles/globals.scss";
import Welcome from "./Welcome";
import SceneCanvas from "./three/SceneCanvas";
import { useRef, useState } from "react";
import Project from "./Project";
import {transitionTimers} from "../data/transitionTimers";

const Main = () => {
  const [bDisplayWelcome, setDisplayWelcome] = useState(true);
  //null => initial state; -1=> no card selected
  const [currentCardId, setCurrentCardId] = useState<number>(null!);

  function handleEnterClick() {
    setDisplayWelcome(false);
  }

  const onCardClicked = (id: number) => {
    setCurrentCardId(id);
  };

  const onBackButtonPressed = () => {
    setCurrentCardId(-1);
  };

  return (
    <>
      {bDisplayWelcome ? (
        <Welcome onEnterClicked={handleEnterClick} />
      ) : (
        <SceneCanvas
          onCardClicked={onCardClicked}
          currentCardId={currentCardId}
        />
      )}
      {currentCardId != null && currentCardId != -1 && (
        <Project
          id={currentCardId}
          onBackButtonPressed={onBackButtonPressed}
          transitionTimer={
            transitionTimers.find((timers) => timers.key === "projectIn")
              ?.value!
          }
        ></Project>
      )}
    </>
  );
};

export default Main;

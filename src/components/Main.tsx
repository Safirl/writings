import "../styles/reset.scss";
import "../styles/globals.scss";
import Welcome from "./Welcome";
import SceneCanvas from "./three/SceneCanvas";
import { useRef, useState } from "react";
import Project from "./Project";

const Main = () => {
  const [bDisplayWelcome, setDisplayWelcome] = useState(true);
  //null => initial state; -1=> no card selected
  const [currentCardId, setCurrentCardId] = useState<number>(null!)

  //in ms
  const transitionTimers = [
    //intro
    {
      key: "transitionObjectIntroIn",
      value: 1500
    },

    //project
    {
      key: "projectIn",
      value: 5000
    },
    {
      key: "projectOut",
      value: 3000
    },

    //TransitionObject
    {
      key: "transitionObjectDurationIn",
      value: 2000
    },
    {
      key: "transitionObjectDurationOut",
      value: 1000
    },
    {
      key: "transitionObjectDelayIn",
      value: 3000
    },
    {
      key: "transitionObjectDelayOut",
      value: 0
    },

    //Vignette
    {
      key: "vignetteDurationIn",
      value: 3000
    },
    {
      key: "vignetteDurationOut",
      value: 1000
    },
    {
      key: "vignetteDelayIn",
      value: 1000
    },
    {
      key: "vignetteDelayOut",
      value: 0
    },
  ]

  function handleEnterClick() {
    setDisplayWelcome(false);
  }

  const onCardClicked = (id: number) => {
    setCurrentCardId(id)
  }

  const onBackButtonPressed = () => {
    setCurrentCardId(-1)
  }

  return (
    <>
      {bDisplayWelcome ? (
        <Welcome onEnterClicked={handleEnterClick} />
      ) : (
        <SceneCanvas onCardClicked={onCardClicked} currentCardId={currentCardId} transitionTimers={transitionTimers} />
      )}
      {currentCardId != null && currentCardId != -1 && <Project id={currentCardId} onBackButtonPressed={onBackButtonPressed} transitionTimer={transitionTimers.find((timers) => timers.key === "projectIn")?.value!}></Project>}
    </>
  );
};

export default Main;

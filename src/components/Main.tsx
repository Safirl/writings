import "../styles/reset.scss";
import "../styles/globals.scss";
import Welcome from "./Welcome";
import SceneCanvas from "./three/SceneCanvas";
import { useRef, useState } from "react";
import Project from "./Project";

const Main = () => {
  const [bDisplayWelcome, setDisplayWelcome] = useState(true);
  const [currentCardId, setCurrentCardId] = useState<number>(null!)

  //in ms
  const transitionTimers = [
    //project
    {
      key: "projectIn",
      value: 5000
    },

    //TransitionObject
    {
      key: "projectOut",
      value: 5000
    },
    {
      key: "transitionObjectDurationIn",
      value: 2000
    },
    {
      key: "transitionObjectDurationOut",
      value: 2000
    },
    {
      key: "transitionObjectDelayIn",
      value: 3000
    },
    {
      key: "transitionObjectDelayOut",
      value: 3000
    },

    //Vignette
    {
      key: "vignetteDurationIn",
      value: 3000
    },
    {
      key: "vignetteDurationOut",
      value: 3000
    },
    {
      key: "vignetteDelayIn",
      value: 1000
    },
    {
      key: "vignetteDelayOut",
      value: 1000
    },
  ]

  function handleEnterClick() {
    setDisplayWelcome(false);
  }

  const onCardClicked = (id: number) => {
    setCurrentCardId(id)
  }

  const onBackButtonPressed = () => {
    setCurrentCardId(null!)
  }

  return (
    <>
      {bDisplayWelcome ? (
        <Welcome onEnterClicked={handleEnterClick} />
      ) : (
        <SceneCanvas onCardClicked={onCardClicked} currentCardId={currentCardId} transitionTimers={transitionTimers} />
      )}
      {currentCardId != null && <Project id={currentCardId} onBackButtonPressed={onBackButtonPressed} transitionTimer={transitionTimers.find((timers) => timers.key === "projectIn")?.value!}></Project>}
    </>
  );
};

export default Main;

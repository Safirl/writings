import { GUI } from "lil-gui";

let gui: GUI | null = null;

function getGUI() {
  if (typeof window == "undefined") return null;

  if (!gui) {
    gui = new GUI();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0px";
    gui.domElement.style.left = "0px";
    gui.domElement.style.display = "none";
  }
  return gui;
}

export default getGUI;

import { GUI } from 'lil-gui'

let gui: GUI | null = null;

function getGUI() {
    if (typeof window == 'undefined') return null;

    if (!gui) {
        gui = new GUI();
    }
    return gui;
}

export default getGUI;